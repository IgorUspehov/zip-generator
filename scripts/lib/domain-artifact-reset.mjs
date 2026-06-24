import fs from "fs";
import path from "path";

/** Domain artifacts that must not survive an idea change. */
export const STICKY_DOMAIN_ARTIFACTS = [
  "artifacts/manifests/llm_manifest.json",
  "artifacts/project/PROJECT_TYPE.json",
  "artifacts/pipeline/pipeline_selection.json",
  "artifacts/template/template_manifest.json",
  "artifacts/assembly/assembly_blueprint.json",
  "artifacts/mvp_structure/mvp_structure.json",
  "artifacts/package/mvp_package.json",
  "artifacts/presentation/project_card.json",
];

/** Generated route/service output — must be wiped before a new domain model. */
export const STICKY_DOMAIN_GENERATED_DIRS = [
  "artifacts/backend/generated",
  "artifacts/binding/generated",
  "artifacts/factory_output/backend/generated",
  "artifacts/factory_output/binding/generated",
  "artifacts/factory_output/client_package/backend/generated",
  "artifacts/factory_output/client_package/binding/generated",
  "public/artifacts/backend/generated",
  "public/artifacts/binding/generated",
  "public/artifacts/factory_output/backend/generated",
  "public/artifacts/factory_output/binding/generated",
  "public/artifacts/factory_output/client_package/backend/generated",
  "public/artifacts/factory_output/client_package/binding/generated",
];

function removePathIfExists(root, relPath) {
  const filePath = path.join(root, relPath);
  if (!fs.existsSync(filePath)) return null;
  fs.rmSync(filePath, { recursive: true, force: true });
  return relPath;
}

export function readStoredIdea(root) {
  const manifestPath = path.join(root, "artifacts/manifests/llm_manifest.json");
  if (!fs.existsSync(manifestPath)) return "";
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    return String(manifest?.idea?.raw_user_idea || "").trim();
  } catch {
    return "";
  }
}

export function ideaChanged(root, nextIdea) {
  const previous = readStoredIdea(root);
  const next = String(nextIdea || "").trim();
  if (!previous || !next) return Boolean(next);
  return previous !== next;
}

export function resetDomainArtifacts(root, { publicMirror = true } = {}) {
  const removed = [];
  for (const rel of STICKY_DOMAIN_ARTIFACTS) {
    const targets = [path.join(root, rel)];
    if (publicMirror) targets.push(path.join(root, "public", rel));
    for (const filePath of targets) {
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
        removed.push(path.relative(root, filePath));
      }
    }
  }

  for (const rel of STICKY_DOMAIN_GENERATED_DIRS) {
    if (!publicMirror && rel.startsWith("public/")) continue;
    const entry = removePathIfExists(root, rel);
    if (entry) removed.push(entry);
  }

  return removed;
}

export function clearDomainGeneratedDirs(root, { publicMirror = true } = {}) {
  const removed = [];
  for (const rel of STICKY_DOMAIN_GENERATED_DIRS) {
    if (!publicMirror && rel.startsWith("public/")) continue;
    const entry = removePathIfExists(root, rel);
    if (entry) removed.push(entry);
  }
  return removed;
}

export function clearBackendGeneratedDirs(root, { publicMirror = true } = {}) {
  const removed = [];
  for (const rel of [
    "artifacts/backend/generated",
    "artifacts/factory_output/backend/generated",
    "artifacts/factory_output/client_package/backend/generated",
    ...(publicMirror
      ? [
          "public/artifacts/backend/generated",
          "public/artifacts/factory_output/backend/generated",
          "public/artifacts/factory_output/client_package/backend/generated",
        ]
      : []),
  ]) {
    const entry = removePathIfExists(root, rel);
    if (entry) removed.push(entry);
  }
  return removed;
}

export function clearBindingGeneratedDirs(root, { publicMirror = true } = {}) {
  const removed = [];
  for (const rel of [
    "artifacts/binding/generated",
    "artifacts/factory_output/binding/generated",
    "artifacts/factory_output/client_package/binding/generated",
    ...(publicMirror
      ? [
          "public/artifacts/binding/generated",
          "public/artifacts/factory_output/binding/generated",
          "public/artifacts/factory_output/client_package/binding/generated",
        ]
      : []),
  ]) {
    const entry = removePathIfExists(root, rel);
    if (entry) removed.push(entry);
  }
  return removed;
}
