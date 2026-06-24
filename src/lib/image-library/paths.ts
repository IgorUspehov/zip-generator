import fs from "fs";
import path from "path";

import { resolveImageLibraryFolder } from "@/lib/image-library/business-type-map";

const IMAGE_LIBRARY_URL_PREFIX = "/image-library";

export function getImageLibraryUrlPrefix(): string {
  return IMAGE_LIBRARY_URL_PREFIX;
}

export function getImageLibraryFolderUrl(businessType: string): string {
  const folder = resolveImageLibraryFolder(businessType);
  return `${IMAGE_LIBRARY_URL_PREFIX}/${folder}`;
}

export function getHeroImagePath(businessType: string): string {
  return `${getImageLibraryFolderUrl(businessType)}/hero.jpg`;
}

export function getGalleryImagePaths(businessType: string): string[] {
  const base = getImageLibraryFolderUrl(businessType);
  return [1, 2, 3].map((index) => `${base}/gallery-${index}.jpg`);
}

export function getOgImagePath(businessType: string): string {
  return `${getImageLibraryFolderUrl(businessType)}/og.jpg`;
}

/** Server filesystem path to public/image-library */
export function getImageLibraryRoot(projectRoot = process.cwd()): string {
  return path.join(projectRoot, "public", "image-library");
}

export function resolveOgImageFilePath(businessType: string, projectRoot = process.cwd()): string {
  const folder = resolveImageLibraryFolder(businessType);
  const root = getImageLibraryRoot(projectRoot);
  const primary = path.join(root, folder, "og.jpg");
  if (fs.existsSync(primary)) {
    return primary;
  }
  return path.join(root, "generic", "og.jpg");
}

export function ensureImageLibraryInDist(stagingDir: string, projectRoot = process.cwd()): void {
  const source = getImageLibraryRoot(projectRoot);
  const destination = path.join(stagingDir, "image-library");
  if (!fs.existsSync(source)) {
    console.warn("[image-library] library root missing:", source);
    return;
  }
  if (fs.existsSync(destination)) {
    return;
  }
  fs.cpSync(source, destination, { recursive: true });
}
