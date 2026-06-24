import assert from "node:assert/strict";

import {
  BUSINESS_TYPE_MEDIA_FOLDER,
  pickRandomGalleryPhotos,
  pickRandomHeroPhoto,
} from "../src/lib/manifest/niche-media.ts";

const REAL_ESTATE_TYPES = ["real_estate", "real_estate_crm"] as const;
const FORBIDDEN_MARKERS = ["/beauty", "/beauty_salon/", "/hotel/", "/assets/niches/beauty"];

console.log("BUSINESS_TYPE_MEDIA_FOLDER (real_estate keys):");
for (const key of REAL_ESTATE_TYPES) {
  console.log(`  ${key} -> ${BUSINESS_TYPE_MEDIA_FOLDER[key]}`);
  assert.equal(BUSINESS_TYPE_MEDIA_FOLDER[key], "real_estate");
  assert.notEqual(BUSINESS_TYPE_MEDIA_FOLDER[key], "beauty");
}

for (const businessType of REAL_ESTATE_TYPES) {
  const hero = pickRandomHeroPhoto(businessType);
  const gallery = pickRandomGalleryPhotos(businessType);

  assert.equal(hero, "/image-library/real_estate/hero.jpg");
  assert.deepEqual(gallery, [
    "/image-library/real_estate/gallery-1.jpg",
    "/image-library/real_estate/gallery-2.jpg",
    "/image-library/real_estate/gallery-3.jpg",
  ]);

  for (const path of [hero, ...gallery]) {
    for (const marker of FORBIDDEN_MARKERS) {
      assert.ok(!path.includes(marker), `${businessType} path must not include ${marker}: ${path}`);
    }
  }

  console.log(`[PASS] ${businessType} hero=${hero}`);
  console.log(`[PASS] ${businessType} gallery=${gallery.join(", ")}`);
}

console.log("\nreal-estate source mapping — all checks passed");
