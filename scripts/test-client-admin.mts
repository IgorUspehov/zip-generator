import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";

import { collectOwnerEmails, recordOwnsEmail, resolveMagicLinkClientId } from "../src/lib/admin/lookup.ts";
import { applySiteContentPatch, parseSiteContentPatch, readSiteContent } from "../src/lib/admin/site-content.ts";
import {
  buildAdminSessionValue,
  parseAdminSessionValue,
  createAdminSession,
} from "../src/lib/admin/session.ts";
import { createMagicLink, consumeMagicLink } from "../src/lib/admin/magic-link.ts";
import { resolveClientMediaFile, isClientMediaUrl } from "../src/lib/admin/media-store.ts";
import { normalizeManifestMedia } from "../src/lib/manifest/normalize-manifest-media.ts";
import { validateClientManifest } from "../src/lib/manifest/schema.ts";
import { listActiveProtectedClientIds, markClientAdminEdited } from "../src/lib/site-delivery/dist-protection.ts";
import { saveClientManifest } from "../src/lib/manifest/storage.ts";
import { resolvePublicAppOrigin, resolveMagicLinkOrigin } from "../src/lib/cloudflare/shared-project.ts";

process.env.PERSISTENT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "admin-test-"));
process.env.ADMIN_SESSION_SECRET = "test-admin-secret";

const fixturePath = path.join(process.cwd(), "data/manifests");
if (fs.existsSync(fixturePath)) {
  const sampleFile = fs.readdirSync(fixturePath).find((name) => name.endsWith(".json"));
  if (sampleFile) {
    const raw = JSON.parse(fs.readFileSync(path.join(fixturePath, sampleFile), "utf8")) as Record<string, unknown>;
    const content = readSiteContent(raw);
    assert.ok(typeof content.businessName === "string");
    assert.ok(Array.isArray(content.galleryPhotos));
    console.log("[PASS] existing manifest JSON is readable by admin content helper");
  }
}

{
  const legacy = {
    businessName: "Alt",
    ownerName: "Owner",
    businessType: "beauty_salon",
    niche: "beauty",
    language: "de",
    city: "München",
    phone: "+49 89 000",
    email: "old@example.com",
    address: "Street 1",
    sectorId: "beauty",
    primaryColor: "#c2410c",
    theme: {
      primary: "#111",
      secondary: "#222",
      accent: "#c2410c",
      hero_bg: "#000",
      text: "#fff",
      border: "#333",
    },
    promotion: { ru: "x", de: "x", en: "x" },
    pages: ["dashboard"],
  };
  const result = validateClientManifest(legacy);
  assert.equal(result.ok, true, result.ok ? "" : result.error);
  console.log("[PASS] legacy manifest without logo/social still validates");
}

{
  const parsed = parseSiteContentPatch({
    businessName: "Studio Nord",
    clientId: "should-be-ignored",
    niche: "beauty",
    description: "New about",
    socialLinks: { instagram: "https://instagram.com/x" },
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) throw new Error(parsed.error);
  assert.equal("clientId" in parsed.patch, false);
  assert.equal(parsed.patch.businessName, "Studio Nord");
  const next = applySiteContentPatch(
    {
      businessName: "Old",
      email: "a@b.c",
      phone: "1",
      address: "Street",
      city: "München",
    },
    parsed.patch,
  );
  assert.equal(next.businessName, "Studio Nord");
  assert.equal(next.description, "New about");
  assert.equal((next.socialLinks as { instagram: string }).instagram, "https://instagram.com/x");
  assert.equal(next.clientId, undefined);
  console.log("[PASS] PATCH whitelist ignores system fields");
}

{
  const session = createAdminSession("client-a", "owner@example.com");
  const value = buildAdminSessionValue(session);
  const parsed = parseAdminSessionValue(value);
  assert.ok(parsed);
  assert.equal(parsed?.clientId, "client-a");
  assert.equal(parsed?.email, "owner@example.com");
  assert.equal(parseAdminSessionValue(value.slice(0, -2) + "00"), null);
  console.log("[PASS] admin HMAC session roundtrip");
}

{
  const record = {
    email: "Owner@Example.com",
    polarEmail: "uspeh.polimer2022+test1@gmail.com",
    questionnaire: { email: "second@example.com" },
    manifest: { email: "site@example.com" },
  };
  assert.deepEqual(collectOwnerEmails(record).sort(), [
    "owner@example.com",
    "second@example.com",
    "site@example.com",
    "uspeh.polimer2022+test1@gmail.com",
  ]);
  assert.equal(recordOwnsEmail(record, "uspeh.polimer2022+test1@gmail.com"), true);
  assert.equal(recordOwnsEmail(record, "uspeh.polimer2022+test3@gmail.com"), true);
  assert.equal(recordOwnsEmail(record, "uspeh.polimer2022@gmail.com"), true);
  assert.equal(recordOwnsEmail(record, "nobody@example.com"), false);
  console.log("[PASS] owner email lookup includes polar + questionnaire aliases");
}

{
  const prev = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://localhost:10000";
  assert.equal(resolvePublicAppOrigin(), "https://webstudio-muenchen.com");
  process.env.NEXT_PUBLIC_SITE_URL = "https://webstudio-muenchen.com";
  assert.equal(resolvePublicAppOrigin(), "https://webstudio-muenchen.com");
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const origin = resolveMagicLinkOrigin(new Request("https://localhost:10000/api/admin/login"));
  assert.equal(origin, "https://webstudio-muenchen.com");
  assert.equal(origin.includes("localhost"), false);
  process.env.NODE_ENV = previousNodeEnv;
  process.env.NEXT_PUBLIC_SITE_URL = prev;
  console.log("[PASS] production magic-link origin is webstudio-muenchen.com");
}

{
  saveClientManifest("client-old", {
    businessName: "Old Shop",
    email: "uspeh.polimer2022+test2@gmail.com",
  });
  saveClientManifest("client-avtomoy", {
    businessName: "Автомой",
    email: "uspeh.polimer2022+test2@gmail.com",
  });
  const hinted = await resolveMagicLinkClientId(
    "uspeh.polimer2022+test2@gmail.com",
    "client-avtomoy",
  );
  assert.equal(hinted, "client-avtomoy");
  const rejected = await resolveMagicLinkClientId(
    "uspeh.polimer2022+test2@gmail.com",
    "someone-else",
  );
  assert.equal(rejected, null);
  const single = await resolveMagicLinkClientId("uspeh.polimer2022+test2@gmail.com");
  assert.equal(typeof single, "string");
  assert.equal(single === "client-old" || single === "client-avtomoy", true);
  console.log("[PASS] magic link resolves a single clientId");
}

{
  const { token } = createMagicLink({ clientId: "client-a", email: "owner@example.com" });
  const first = consumeMagicLink(token);
  assert.equal(first.ok, true);
  const second = consumeMagicLink(token);
  assert.equal(second.ok, false);
  if (!second.ok) assert.equal(second.reason, "used");
  const missing = consumeMagicLink("deadbeef");
  assert.equal(missing.ok, false);
  console.log("[PASS] magic link single-use");
}

{
  const clientId = "abc-123";
  const file = resolveClientMediaFile(clientId, "hero.jpg");
  assert.match(file, /client-media/);
  assert.throws(() => resolveClientMediaFile(clientId, "../etc/passwd"));
  assert.throws(() => resolveClientMediaFile("../x", "hero.jpg"));
  assert.equal(isClientMediaUrl(`/api/media/${clientId}/hero.jpg`, clientId), true);
  const kept = normalizeManifestMedia({
    businessType: "beauty_salon",
    heroPhoto: `/api/media/${clientId}/hero.jpg`,
    galleryPhotos: [`/api/media/${clientId}/gallery-1.jpg`],
  });
  assert.equal(kept.heroPhoto, `/api/media/${clientId}/hero.jpg`);
  console.log("[PASS] media path safety + normalize keeps uploads");
}

{
  const clientId = "admin-edited-tenant";
  markClientAdminEdited(clientId);
  assert.equal(listActiveProtectedClientIds().has(clientId), true);
  console.log("[PASS] admin-edited sites are retention-protected");
}

{
  const content = readSiteContent({
    businessName: "Cafe",
    workingHours: { monday: "08:00-16:00" },
    social_links: { instagram: "https://ig" },
  });
  assert.equal(content.workingHours.monday, "08:00-16:00");
  assert.equal(content.socialLinks.instagram, "https://ig");
  console.log("[PASS] content reader is backward-compatible");
}

console.log("[PASS] client admin unit tests");

{
  const polar = fs.readFileSync("src/lib/polar/constants.ts", "utf8");
  const tariffs = fs.readFileSync("src/lib/tariffs/copy.ts", "utf8");
  const wizard = fs.readFileSync("src/client-wizard/api.ts", "utf8");
  assert.match(polar, /POLAR_CHECKOUT_WEBSTUDIO_199/);
  assert.match(tariffs, /€199/);
  assert.match(wizard, /\/api\/client-questionnaire/);
  console.log("[PASS] existing €199 / wizard / Polar constants unchanged");
}
