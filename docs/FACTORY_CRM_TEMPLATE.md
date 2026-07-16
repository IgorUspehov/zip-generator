# Factory Website+CRM → Cloudflare Pages (via existing pipeline)

`mvp-template/` is gitignored. Populate it from the Factory template before Railway deploy.

## Refresh dist

```bash
cd ../Factory-Website-CRM
npm run build
./scripts/export-template-dist.sh ../saas-mvp-funnel/mvp-template/dist
```

Or set `MVP_DIST_PATH` to Factory `dist/`.

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

Live `*.pages.dev` URL is still produced by `deployDistToPages` in
`src/lib/cloudflare/deploy.ts` when `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN`
are set on Railway.
