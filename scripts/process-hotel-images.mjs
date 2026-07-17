#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const COLLAGE_PATH = "/home/igor/Загрузки/ChatGPT Image 15 июл. 2026 г., 00_02_40.png";
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_MAX_BYTES = 256000;
const LABEL_CROP_BOTTOM = 48;
const BORDER = 4;

const TARGET_ROOTS = [
  path.join(projectRoot, "public", "image-library", "hotel"),
  path.join(
    projectRoot,
    "artifacts",
    "factory_output",
    "react_mvp",
    "public",
    "image-library",
    "hotel",
  ),
];

/** Detect white separator bands on one axis within a region. */
async function findSeparatorBands(imagePath, width, height, axis, y0 = 0, y1 = height) {
  const { data } = await sharp(imagePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bands = [];
  const thickness = axis === "x" ? width : height;
  const crossStart = axis === "x" ? y0 : 0;
  const crossEnd = axis === "x" ? y1 : width;

  for (let i = BORDER; i < thickness - BORDER; i++) {
    let whiteCount = 0;
    let total = 0;
    for (let j = crossStart; j < crossEnd; j++) {
      const x = axis === "x" ? i : j;
      const y = axis === "x" ? j : i;
      const idx = (y * width + x) * 3;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      total += 1;
      if (brightness > 200) whiteCount += 1;
    }
    if (whiteCount / total > 0.85) {
      const last = bands[bands.length - 1];
      if (last && last.end === i) last.end = i + 1;
      else bands.push({ start: i, end: i + 1 });
    }
  }
  return bands.filter((b) => b.end - b.start >= 2 && b.end - b.start <= 16);
}

function regionsFromBands(size, bands) {
  const separators = bands
    .map((b) => Math.floor((b.start + b.end) / 2))
    .sort((a, b) => a - b);
  const edges = [BORDER, ...separators, size - BORDER];
  const regions = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const start = edges[i];
    const end = edges[i + 1];
    if (end - start > 80) regions.push({ start, end });
  }
  return regions;
}

async function writeJpegUnderLimit(input, outputPath, width, height) {
  let quality = 88;
  let out = Buffer.alloc(0);
  while (quality >= 45) {
    out = await sharp(input)
      .resize(width, height, { fit: "cover", position: "centre" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (out.length <= OG_MAX_BYTES) break;
    quality -= 5;
  }
  await fs.promises.writeFile(outputPath, out);
  return out.length;
}

async function main() {
  const meta = await sharp(COLLAGE_PATH).metadata();
  const { width, height } = meta;

  const yBands = await findSeparatorBands(COLLAGE_PATH, width, height, "y");
  const rowSplit = yBands.find((b) => b.start > height * 0.4 && b.start < height * 0.65);
  if (!rowSplit) throw new Error("Could not detect horizontal collage split");

  const topY1 = rowSplit.start;
  const bottomY0 = rowSplit.end;

  const topXBands = await findSeparatorBands(COLLAGE_PATH, width, height, "x", BORDER, topY1);
  const bottomXBands = await findSeparatorBands(
    COLLAGE_PATH,
    width,
    height,
    "x",
    bottomY0,
    height - BORDER,
  );

  const topCols = regionsFromBands(width, topXBands);
  const bottomCols = regionsFromBands(width, bottomXBands);
  const rows = [
    { start: BORDER, end: topY1 },
    { start: bottomY0, end: height - BORDER },
  ];

  if (topCols.length !== 2 || bottomCols.length !== 3) {
    throw new Error(
      `Unexpected grid: topCols=${topCols.length}, bottomCols=${bottomCols.length}`,
    );
  }

  const panels = [
    { name: "hero.jpg", col: topCols[0], row: rows[0] },
    { name: "gallery-1.jpg", col: topCols[1], row: rows[0] },
    { name: "gallery-2.jpg", col: bottomCols[0], row: rows[1] },
    { name: "gallery-3.jpg", col: bottomCols[1], row: rows[1] },
    { name: "og.jpg", col: bottomCols[2], row: rows[1] },
  ];

  const tmpDir = path.join(projectRoot, "output/hotel-image-tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const extracted = {};
  for (const panel of panels) {
    const extractWidth = panel.col.end - panel.col.start;
    const extractHeight = panel.row.end - panel.row.start - LABEL_CROP_BOTTOM;
    const outPath = path.join(tmpDir, panel.name);

    await sharp(COLLAGE_PATH)
      .extract({
        left: panel.col.start,
        top: panel.row.start,
        width: extractWidth,
        height: Math.max(1, extractHeight),
      })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(outPath);

    extracted[panel.name] = outPath;
    console.log(
      `extracted ${panel.name}: ${extractWidth}x${extractHeight} @ (${panel.col.start},${panel.row.start})`,
    );
  }

  for (const targetRoot of TARGET_ROOTS) {
    fs.mkdirSync(targetRoot, { recursive: true });
    for (const panel of panels) {
      const dest = path.join(targetRoot, panel.name);
      if (panel.name === "og.jpg") {
        const bytes = await writeJpegUnderLimit(extracted[panel.name], dest, OG_WIDTH, OG_HEIGHT);
        console.log(`saved ${dest} (${bytes} bytes, ${OG_WIDTH}x${OG_HEIGHT})`);
      } else {
        await fs.promises.copyFile(extracted[panel.name], dest);
        const stat = fs.statSync(dest);
        console.log(`saved ${dest} (${stat.size} bytes)`);
      }
    }
  }

  console.log("\nFinal files:");
  for (const targetRoot of TARGET_ROOTS) {
    console.log(`\n${targetRoot}`);
    for (const panel of panels) {
      const p = path.join(targetRoot, panel.name);
      const m = await sharp(p).metadata();
      const stat = fs.statSync(p);
      console.log(`  ${panel.name}: ${m.width}x${m.height}, ${stat.size} bytes`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
