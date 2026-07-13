import {
  findLargestFiles,
  getDiskSpaceStats,
  getFolderSizes,
  runStorageCleanup,
} from "../src/lib/manifest/storage-manager";
import { resolvePersistentDataDir } from "../src/lib/site-delivery/data-dir";

const dataRoot = resolvePersistentDataDir();
const beforeDisk = getDiskSpaceStats(dataRoot);
const beforeFolders = getFolderSizes();

console.log("=== Storage volume report ===");
console.log("data root:", dataRoot);
console.log("folder sizes before:", beforeFolders);
console.log(
  "free space before:",
  `${(beforeDisk.freeBytes / (1024 * 1024)).toFixed(2)} MB`,
  beforeDisk.usedPercent !== null ? `(${beforeDisk.usedPercent}% used)` : "",
);

console.log("\n=== Largest files (top 20) ===");
for (const file of findLargestFiles(20)) {
  console.log(`${file.sizeMb} MB\t${file.path}`);
}

const result = runStorageCleanup({ aggressive: beforeDisk.freeBytes < 100 * 1024 * 1024 });
const freedMb = result.freeSpaceAfterMb - result.freeSpaceBeforeMb;

console.log("\n=== Cleanup result ===");
console.log("[storage] deleted manifests:", result.deletedManifests);
console.log("[storage] deleted client-dists:", result.deletedClientDists);
console.log("[storage] deleted zip files:", result.deletedZipFiles);
console.log("[storage] deleted pending-deletions:", result.deletedPendingDeletions);
console.log("[storage] free space before:", `${result.freeSpaceBeforeMb.toFixed(2)} MB`);
console.log("[storage] free space after:", `${result.freeSpaceAfterMb.toFixed(2)} MB`);
console.log("[storage] freed:", `${freedMb.toFixed(2)} MB`);
if (result.usedPercent !== null) {
  console.log("[storage] volume used:", `${result.usedPercent}%`);
}
console.log("folder sizes after:", result.folderSizesAfter);
