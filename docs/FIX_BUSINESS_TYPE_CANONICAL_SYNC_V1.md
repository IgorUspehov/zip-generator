# FIX_BUSINESS_TYPE_CANONICAL_SYNC_V1

**Date:** 2026-06-14  
**Scope:** Canonical `business_type` across preview, README, Result API, and ZIP

---

## Problem

Preview, README, and Result API showed `beauty_salon`, but the legacy ZIP still contained:

- `client_profile.json` → `business_type: barbershop`
- `manifest.json` → `package_metadata.business_type: barbershop`

Alias `barbershop` leaked into deliverables while UI/API used normalized category.

---

## Rule

**One canonical `business_type`** = normalized category (via `config/client_delivery_v2_category_aliases.json`).

If active preview = `beauty_salon`, then everywhere:

- Preview API `business_type`
- README
- ZIP `manifest.json` (`business_type` + `package_metadata.business_type`)
- ZIP `client_data/client_profile.json` (`business_type` + `selected_business_category`)

All must be literally `beauty_salon`. Aliases like `barbershop` are forbidden in deliverables.

---

## Validation (FAIL if any mismatch)

```
active_preview.business_type
== manifest.business_type
== client_profile.business_type
== package_metadata.business_type
```

Implemented in `src/lib/client-preview/business-type-canonical.ts`:

- `validateZipBusinessTypeConsistency()` — reads live ZIP entries
- `validateActivePreviewBusinessTypeConsistency()` — compares preview vs ZIP

Materialization fails closed when validation fails.

---

## Fix

### 1. `active-artifact-context.ts`

- `buildIdentity()` sets `business_type = normalized_category` (never raw alias)
- `assessActiveArtifacts()` checks all client sources share the same `business_type`

### 2. `business-type-canonical.ts` (new)

- `canonicalBusinessType()` — alias normalization
- `patchJsonCanonicalBusinessType()` — recursive JSON patch
- `rebuildZipWithCanonicalBusinessType()` — unzip legacy package, patch all `.json`, re-zip, validate

### 3. `client-delivery-materializer.ts`

- Legacy path: rebuild ZIP with canonical types (no blind copy)
- V2 path: write canonical `business_type` into manifest + client_profile
- Stamp includes canonical `business_type` to invalidate stale packages
- Post-build ZIP validation before serving

### 4. `preview-service.ts`

- Result/Preview API use `canonical.business_type` (not separate normalized field)

---

## Verification

```bash
npm run build   # PASS
```

After materialization:

```bash
unzip -p output/client_delivery_live/final_package.zip manifest.json | jq '.business_type, .package_metadata.business_type'
unzip -p output/client_delivery_live/final_package.zip client_data/client_profile.json | jq '.business_type'
```

All must return `beauty_salon`. No `barbershop` anywhere in ZIP JSON.
