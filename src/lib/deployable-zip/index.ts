export {
  buildDeployableZip,
  buildDeployableZipBuffer,
  buildDeployableZipFilename,
  DeployableZipError,
  resolveDeployableDistPath,
  assertDistBelongsToClient,
} from "@/lib/deployable-zip/builder";

export { buildDeployableZipReadme } from "@/lib/deployable-zip/readme";

export {
  sanitizeManifestForZip,
  sanitizeStagingDist,
  markStagingAsPaidBuyer,
  shouldExcludeBasename,
  findContentSecretReasons,
  collectClientIdMentions,
} from "@/lib/deployable-zip/sanitize";

export {
  stripDemoPaywallFromDist,
  buildDeployablePaidBootstrap,
} from "@/lib/deployable-zip/strip-demo-paywall";

export type {
  BuildDeployableZipInput,
  DeployableZipBuildResult,
  DeployableZipMode,
  DeployableZipLanguage,
  DeployableZipReadmeContext,
  DeployableZipSecurityReport,
  DeployableZipIsolationReport,
  SecretFinding,
} from "@/lib/deployable-zip/types";
