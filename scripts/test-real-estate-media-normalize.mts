import assert from "node:assert/strict";

import { normalizeManifestMedia } from "../src/lib/manifest/normalize-manifest-media.ts";

function expectRealEstateMedia(manifest: Record<string, unknown>) {
  assert.equal(manifest.heroPhoto, "/image-library/real_estate/hero.jpg");
  assert.deepEqual(manifest.galleryPhotos, [
    "/image-library/real_estate/gallery-1.jpg",
    "/image-library/real_estate/gallery-2.jpg",
    "/image-library/real_estate/gallery-3.jpg",
  ]);
}

// 1. real_estate with beauty_salon image-library paths
{
  const out = normalizeManifestMedia({
    businessType: "real_estate",
    heroPhoto: "/image-library/beauty_salon/hero.jpg",
    galleryPhotos: [
      "/image-library/beauty_salon/gallery-1.jpg",
      "/image-library/beauty_salon/gallery-2.jpg",
      "/image-library/beauty_salon/gallery-3.jpg",
    ],
  });
  expectRealEstateMedia(out);
  console.log("[PASS] real_estate + beauty_salon image-library paths");
}

// 2. real_estate with legacy beauty niche paths
{
  const out = normalizeManifestMedia({
    business_type: "real_estate",
    hero_photo: "/assets/niches/beauty/beauty_01.jpg",
    gallery_photos: [
      "/assets/niches/beauty/beauty_02.jpg",
      "/assets/niches/hotel/hotel_03.jpg",
    ],
  });
  expectRealEstateMedia(out);
  console.log("[PASS] real_estate + legacy /assets/niches/ paths");
}

// 3. real_estate with hotel image-library paths
{
  const out = normalizeManifestMedia({
    businessType: "real_estate",
    heroPhoto: "/image-library/hotel/hero.jpg",
    galleryPhotos: ["/image-library/hotel/gallery-1.jpg"],
  });
  expectRealEstateMedia(out);
  console.log("[PASS] real_estate + hotel image-library paths");
}

// 4. correct real_estate paths unchanged
{
  const input = {
    businessType: "real_estate",
    heroPhoto: "/image-library/real_estate/hero.jpg",
    galleryPhotos: [
      "/image-library/real_estate/gallery-1.jpg",
      "/image-library/real_estate/gallery-2.jpg",
      "/image-library/real_estate/gallery-3.jpg",
    ],
  };
  const out = normalizeManifestMedia(input);
  assert.equal(out.heroPhoto, input.heroPhoto);
  assert.deepEqual(out.galleryPhotos, input.galleryPhotos);
  console.log("[PASS] correct real_estate paths preserved");
}

// 5. other niches unchanged
{
  const input = {
    businessType: "car_dealer",
    heroPhoto: "/image-library/car_dealer/hero.jpg",
    galleryPhotos: [
      "/image-library/car_dealer/gallery-1.jpg",
      "/image-library/car_dealer/gallery-2.jpg",
      "/image-library/car_dealer/gallery-3.jpg",
    ],
  };
  const out = normalizeManifestMedia(input);
  assert.equal(out.heroPhoto, input.heroPhoto);
  assert.deepEqual(out.galleryPhotos, input.galleryPhotos);
  console.log("[PASS] car_dealer paths preserved");
}

{
  const input = {
    businessType: "dental_clinic",
    heroPhoto: "/image-library/dental_clinic/hero.jpg",
    galleryPhotos: ["/image-library/dental_clinic/gallery-1.jpg"],
  };
  const out = normalizeManifestMedia(input);
  assert.equal(out.heroPhoto, input.heroPhoto);
  console.log("[PASS] dental_clinic paths preserved");
}

{
  const input = {
    businessType: "car_service",
    heroPhoto: "/image-library/car_dealer/hero.jpg",
    galleryPhotos: ["/image-library/car_dealer/gallery-1.jpg"],
  };
  const out = normalizeManifestMedia(input);
  assert.equal(out.heroPhoto, input.heroPhoto);
  console.log("[PASS] logistics/car_service mapped car_dealer paths preserved");
}

console.log("\nreal-estate media normalization — all checks passed");
