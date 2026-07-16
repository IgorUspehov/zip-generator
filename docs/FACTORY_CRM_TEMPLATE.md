# Factory Website+CRM → Cloudflare Pages (via existing pipeline)

## Source of truth for client dist

Committed path: `client-template/dist` (built from sibling `Factory-Website-CRM`).

`resolveMvpDistPath()` order:
1. `MVP_DIST_PATH` (optional)
2. `client-template/dist` ← **production**
3. `mvp-template/dist` (local/gitignored mirror)
4. `artifacts/factory_output/react_mvp/dist` (legacy)

## Refresh dist from Factory

```bash
cd ../Factory-Website-CRM
npm run build
./scripts/export-template-dist.sh ../saas-mvp-funnel/client-template/dist
# optional local mirror:
./scripts/export-template-dist.sh ../saas-mvp-funnel/mvp-template/dist
```

## Runtime bootstrap

`prepareClientDistWithOgImage` injects:

```js
window.__FACTORY_BOOTSTRAP__ = {
  clientId, mode: "product", manifest: /* Factory Manifest 1.0 */, siteUrl
}
```

Mapper: `src/lib/factory-crm/mapToFactoryManifest.ts`

## Smoke (no Cloudflare API)

```bash
npm run smoke:factory-crm
```

Live `*.pages.dev` URL is produced by `deployDistToPages` when Cloudflare env is set.
