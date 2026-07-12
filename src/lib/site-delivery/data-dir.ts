import path from "path";

export function resolvePersistentDataDir(): string {
  const volumePath = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim();
  if (volumePath) {
    return volumePath;
  }
  return path.join(process.cwd(), "data");
}
