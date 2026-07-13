export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startDeletionScheduler } = await import("@/lib/netlify/scheduler");
    const { startStorageScheduler } = await import("@/lib/manifest/storage-manager");
    startDeletionScheduler();
    startStorageScheduler();
  }
}
