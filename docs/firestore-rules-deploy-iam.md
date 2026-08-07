# Firestore Rules deploy — IAM

Project: **mvp-factory-crm**  
Rules file: `firestore.rules` (deny-all client access)  
Config: `firebase.json`, `.firebaserc`

## Service account (current deploy identity)

```
firebase-adminsdk-fbsvc@mvp-factory-crm.iam.gserviceaccount.com
```

Typically loaded via `GOOGLE_APPLICATION_CREDENTIALS` pointing at the Admin SDK JSON key.

## Why `firebase deploy` failed

```
Error: Request to https://serviceusage.googleapis.com/v1/projects/mvp-factory-crm/services/firestore.googleapis.com
had HTTP Error: 403, Permission denied to get service [firestore.googleapis.com]
```

The Admin SDK service account can read/write Firestore data but lacks:

1. **Firebase Rules API** — create rulesets and update releases
2. **Service Usage Consumer** — CLI checks that `firestore.googleapis.com` is enabled

## Minimal IAM (no Owner / Editor)

| Role | Purpose |
|------|---------|
| `roles/firebaserules.admin` | Create rulesets, patch `cloud.firestore` release |
| `roles/serviceusage.serviceUsageConsumer` | Let Firebase CLI query enabled services |

Existing roles on the SA (keep): `roles/firebase.sdkAdminServiceAgent`, Firestore data access via Admin SDK.

## Owner commands (run once)

```bash
PROJECT=mvp-factory-crm
SA=firebase-adminsdk-fbsvc@mvp-factory-crm.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" \
  --role="roles/firebaserules.admin"

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" \
  --role="roles/serviceusage.serviceUsageConsumer"
```

Verify:

```bash
gcloud projects get-iam-policy mvp-factory-crm \
  --flatten="bindings[].members" \
  --filter="bindings.members:firebase-adminsdk-fbsvc@" \
  --format="table(bindings.role)"
```

## Standard deploy (primary)

```bash
firebase deploy --only firestore:rules --project mvp-factory-crm --non-interactive
```

Or:

```bash
node scripts/deploy-firestore-rules.mjs
```

## Emergency REST fallback

Only when CLI is blocked and rules must ship immediately:

```bash
node scripts/deploy-firestore-rules.mjs --rest-fallback
```

Uses Firebaserules REST API with the same service account (works with `roles/firebaserules.admin` or broader Rules API access).
