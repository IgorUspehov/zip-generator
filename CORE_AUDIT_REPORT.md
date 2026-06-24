# CORE_AUDIT_REPORT

Generated: 2026-06-13T21:16:49.429424+00:00

Project: SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM

Working core copy:

- `/home/igor/Desktop/SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_CORE`
- `/home/igor/Рабочий стол/SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_CORE`

## Size Comparison

| Location | Size |
|---|---|
| Исходный проект (`/home/igor/PROJECT_AI_AGENTS/SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM`) | 2,3G |
| Чистое ядро (`/home/igor/Desktop/SAAS_IDEA_AI_MVP_FACTORY_WEB_CRM_CORE`) | 17M |

Reduction basis: excluded frozen archives (`*.tar.gz`), `node_modules`, `.next`, `multi_business`, `real_mvp`, legacy factories, unused scripts, duplicate `public/artifacts`, runtime test trees, and non-pipeline artifact directories.

---

## WORKING PIPELINE

```
Questionnaire / Manifest
  → npm run questionnaire:generate
  → input/client_onboarding_questionnaire.json

V5 Build Chain (full-v5:pipeline)
  → mvp-assembly-intelligence:generate
  → template-selection-integration:generate
  → mvp-build-orchestrator:generate
  → react-mvp-build-executor:generate
  → client-package-from-react-mvp:generate
  → artifacts/factory_output/react_mvp/

V6 Business Content (full-v6:pipeline)
  → business-content-library:generate
  → business-profile:generate
  → business-content:generate
  → react-mvp-business-content:integrate
  → npm run build (cwd: artifacts/factory_output/react_mvp)

V7 Client Delivery
  → client-readme:generate
  → client-screenshots:generate
  → client-demo-video:generate
  → client-build:generate
  → client-package:generate
  → client-delivery:quality-gate
  → artifacts/factory_output/client_delivery/

V8 Deployment (mode from config/deployment_config.json)
  → deployment-choice:generate
  → netlify-deploy | custom-domain | github-delivery (by mode)
  → deployment-validation:generate
  → deployment-final-quality-gate

Client Onboarding / Delivery UI
  → client-onboarding:generate
  → client-full-delivery:run
      → client-profile:edit
      → client-pipeline:run (client-data → bindings → final-package-binding)
      → client-delivery:generate
  → final-v3:quality-gate
  → npm run client:deliver

V9 Market Validation UI
  → npm run dev / npm run build
  → /showcase
  → /client-questionnaire
  → POST /api/showcase/feedback
```

Control path (from `config/manifest.yml`, `config/deployment_config.json`):

- `project_type`: beauty_salon
- `deployment.mode`: github_only
- `llm_used`: false

---

## ENTRY POINTS

- `npm run build  →  next build`
- `npm run business-content-library:generate  →  python3 -m factory.business_content_library_factory.business_content_library_factory`
- `npm run business-content:generate  →  python3 -m factory.business_content_factory.business_content_factory`
- `npm run business-profile:generate  →  python3 -m factory.business_profile_factory.business_profile_factory`
- `npm run client-build:generate  →  python3 -m factory.client_production_build_factory.client_production_build_factory`
- `npm run client-cleanup:run  →  python3 -m factory.client_temp_file_cleanup_factory.cleanup_scheduler`
- `npm run client-contract-terms:generate  →  python3 -m factory.client_contract_terms_factory.client_contract_terms_factory`
- `npm run client-data:generate  →  python3 -m factory.client_data_factory.client_data_factory`
- `npm run client-data:integrate  →  python3 -m factory.client_data_integration.client_data_integration`
- `npm run client-delivery-button:generate  →  python3 -m factory.client_delivery_button_factory.client_delivery_button_factory`
- `npm run client-delivery-status:generate  →  python3 -m factory.client_delivery_status_factory.client_delivery_status_factory`
- `npm run client-delivery:generate  →  python3 -m factory.client_delivery_factory.client_delivery_factory`
- `npm run client-delivery:quality-gate  →  python3 -m factory.client_delivery_final_quality_gate_factory.client_delivery_final_quality_gate_factory`
- `npm run client-demo-video:generate  →  python3 -m factory.client_demo_video_factory.client_demo_video_factory`
- `npm run client-full-delivery:run  →  python3 -m factory.client_full_delivery_orchestrator.client_full_delivery_orchestrator`
- `npm run client-notification:generate  →  python3 -m factory.client_notification_factory.client_notification_factory`
- `npm run client-onboarding:generate  →  python3 -m factory.client_onboarding_factory.client_onboarding_factory`
- `npm run client-one-command-delivery:generate  →  python3 -m factory.client_one_command_delivery_factory.client_one_command_delivery_factory`
- `npm run client-order-history:generate  →  python3 -m factory.client_order_history_factory.client_order_history_factory`
- `npm run client-package-download:generate  →  python3 -m factory.client_package_download_factory.client_package_download_factory`
- `npm run client-package-from-react-mvp:generate  →  python3 -m factory.client_package_from_react_mvp_factory.client_package_from_react_mvp_factory`
- `npm run client-package:generate  →  python3 -m factory.client_zip_package_factory.client_zip_package_factory`
- `npm run client-pipeline:run  →  python3 -m factory.client_pipeline_orchestrator.client_pipeline_orchestrator`
- `npm run client-profile:edit  →  python3 -m factory.client_profile_editor.client_profile_editor`
- `npm run client-questionnaire-ui:generate  →  python3 -m factory.client_questionnaire_ui_factory.client_questionnaire_ui_factory`
- `npm run client-readme:generate  →  python3 -m factory.client_readme_factory.client_readme_factory`
- `npm run client-screenshots:generate  →  python3 -m factory.client_screenshot_factory.client_screenshot_factory`
- `npm run client-temp-file-cleanup:generate  →  python3 -m factory.client_temp_file_cleanup_factory.client_temp_file_cleanup_factory`
- `npm run client:deliver  →  python3 -m factory.client_one_command_delivery_factory.one_command_runner`
- `npm run custom-domain:generate  →  python3 -m factory.custom_domain_factory.custom_domain_factory`
- `npm run demo-video-binding:generate  →  python3 -m factory.demo_video_binding_factory.demo_video_binding_factory`
- `npm run deploy-binding:generate  →  python3 -m factory.deploy_binding_factory.deploy_binding_factory`
- `npm run deployment-choice:generate  →  python3 -m factory.deployment_choice_factory.deployment_choice_factory`
- `npm run deployment-final-quality-gate  →  python3 -m factory.deployment_final_quality_gate_factory.deployment_final_quality_gate_factory`
- `npm run deployment-validation:generate  →  python3 -m factory.deployment_validation_factory.deployment_validation_factory`
- `npm run dev  →  next dev`
- `npm run final-package-binding:generate  →  python3 -m factory.final_package_binding_factory.final_package_binding_factory`
- `npm run final-v3:quality-gate  →  python3 -m factory.final_v3_quality_gate.final_v3_quality_gate`
- `npm run full-v5:pipeline  →  python3 -m factory.full_v5_pipeline_runner_factory.full_v5_pipeline_runner_factory`
- `npm run full-v5:quality-gate  →  python3 -m factory.full_v5_final_quality_gate_factory.full_v5_final_quality_gate_factory`
- `npm run full-v6:pipeline  →  python3 -m factory.full_v6_pipeline_factory.full_v6_pipeline_factory`
- `npm run full-v6:quality-gate  →  python3 -m factory.full_v6_final_quality_gate_factory.full_v6_final_quality_gate_factory`
- `npm run github-delivery:generate  →  python3 -m factory.github_delivery_factory.github_delivery_factory`
- `npm run knowledge-library-audit:generate  →  python3 -m factory.knowledge_library_audit_factory.knowledge_library_audit_factory`
- `npm run knowledge-library-integration:generate  →  python3 -m factory.knowledge_library_integration_factory.knowledge_library_integration_factory`
- `npm run lint  →  eslint`
- `npm run mvp-assembly-intelligence:generate  →  python3 -m factory.mvp_assembly_intelligence_factory.mvp_assembly_intelligence_factory`
- `npm run mvp-build-orchestrator:generate  →  python3 -m factory.mvp_build_orchestrator_factory.mvp_build_orchestrator_factory`
- `npm run netlify-deploy:generate  →  python3 -m factory.netlify_deploy_factory.netlify_deploy_factory`
- `npm run payment-integration:generate  →  python3 -m factory.payment_integration_factory.payment_integration_factory`
- `npm run questionnaire:generate  →  python3 factory/questionnaire_factory/questionnaire_factory.py`
- `npm run react-mvp-build-executor:generate  →  python3 -m factory.react_mvp_build_executor_factory.react_mvp_build_executor_factory`
- `npm run react-mvp-business-content:integrate  →  python3 -m factory.react_mvp_business_content_integration_factory.react_mvp_business_content_integration_factory`
- `npm run react-ui-binding:generate  →  python3 -m factory.react_ui_binding_factory.react_ui_binding_factory`
- `npm run start  →  next start`
- `npm run template-selection-integration:generate  →  python3 -m factory.template_selection_integration_factory.template_selection_integration_factory`
- `next dev / next build / next start  →  src/app/* (CRM UI, /showcase, /client-questionnaire)`
- `input/client_onboarding_questionnaire.json  →  mvp-assembly-intelligence`
- `config/manifest.yml + config/deployment_config.json  →  deployment-choice / quality gates`
- `knowledge_library/{lang}/{category}/  →  assembly + business content + questionnaire API`

---

## DEPENDENCIES

### npm dependencies (package.json — all retained in core copy)

- `@radix-ui/react-accordion`: ^1.2.13
- `@radix-ui/react-collapsible`: ^1.1.13
- `@radix-ui/react-dialog`: ^1.1.16
- `@radix-ui/react-progress`: ^1.1.9
- `@radix-ui/react-scroll-area`: ^1.2.11
- `@radix-ui/react-separator`: ^1.1.9
- `@radix-ui/react-slot`: ^1.2.3
- `@radix-ui/react-tabs`: ^1.1.14
- `@radix-ui/react-tooltip`: ^1.2.9
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `lucide-react`: ^0.511.0
- `next`: 15.3.3
- `radix-ui`: ^1.5.0
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `tailwind-merge`: ^3.3.0
- `tw-animate-css`: ^1.4.0

### npm devDependencies (package.json — all retained in core copy)

- `archiver`: ^7.0.1
- `@eslint/eslintrc`: ^3
- `@tailwindcss/postcss`: ^4
- `@types/node`: ^20
- `@types/react`: ^19
- `@types/react-dom`: ^19
- `eslint`: ^9
- `eslint-config-next`: 15.3.3
- `playwright`: ^1.52.0
- `tailwindcss`: ^4
- `typescript`: ^5

### Runtime tools referenced by working factories

- `python3` — factory modules
- `node` / `npm` — scripts and Next.js CRM
- `ffmpeg` / `ffprobe` — client-demo-video (optional at runtime)
- Playwright — client-screenshots (devDependency)

---

## USED FILES

### Top-level directories included in core

- `src/`
- `config/`
- `input/`
- `knowledge_library/`
- `patterns/`
- `docs/architecture/`
- `docs/market_validation/`
- `factory/`
- `scripts/`
- `artifacts/factory_output/`
- `output/`
- `public/`

### Root files included in core

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `next-env.d.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `tailwind.config.ts`
- `components.json`
- `README.md`
- `V9_MARKET_VALIDATION_PLAN.md`
- `POST_DEPLOYMENT_FEEDBACK_REVIEW.md`
- `PROJECT_WEIGHT_AUDIT_REPORT.md`
- `RULE_3_ARCHITECTURE_REVIEW.md`

### Factory modules included (58)

- `factory/business_content_factory/`
- `factory/business_content_library_factory/`
- `factory/business_profile_factory/`
- `factory/client_contract_terms_factory/`
- `factory/client_data_factory/`
- `factory/client_data_integration/`
- `factory/client_delivery_button_factory/`
- `factory/client_delivery_factory/`
- `factory/client_delivery_final_quality_gate_factory/`
- `factory/client_delivery_status_factory/`
- `factory/client_demo_video_factory/`
- `factory/client_full_delivery_orchestrator/`
- `factory/client_notification_factory/`
- `factory/client_onboarding_factory/`
- `factory/client_one_command_delivery_factory/`
- `factory/client_order_history_factory/`
- `factory/client_package_download_factory/`
- `factory/client_package_from_react_mvp_factory/`
- `factory/client_package_runtime_test/`
- `factory/client_pipeline_orchestrator/`
- `factory/client_production_build_factory/`
- `factory/client_profile_editor/`
- `factory/client_questionnaire_ui_factory/`
- `factory/client_readme_factory/`
- `factory/client_screenshot_factory/`
- `factory/client_temp_file_cleanup_factory/`
- `factory/client_zip_package_factory/`
- `factory/custom_domain_factory/`
- `factory/demo_video_binding_factory/`
- `factory/deploy_binding_factory/`
- `factory/deploy_factory/`
- `factory/deploy_runtime_validator/`
- `factory/deployment_choice_factory/`
- `factory/deployment_final_quality_gate_factory/`
- `factory/deployment_validation_factory/`
- `factory/final_package_binding_factory/`
- `factory/final_package_factory/`
- `factory/final_v3_quality_gate/`
- `factory/full_v5_final_quality_gate_factory/`
- `factory/full_v5_pipeline_runner_factory/`
- `factory/full_v6_final_quality_gate_factory/`
- `factory/full_v6_pipeline_factory/`
- `factory/github_delivery_factory/`
- `factory/knowledge_library_audit_factory/`
- `factory/knowledge_library_factory/`
- `factory/knowledge_library_integration_factory/`
- `factory/knowledge_router_factory/`
- `factory/mvp_assembly_intelligence_factory/`
- `factory/mvp_build_orchestrator_factory/`
- `factory/netlify_deploy_factory/`
- `factory/payment_integration_factory/`
- `factory/questionnaire_factory/`
- `factory/react_mvp_build_executor_factory/`
- `factory/react_mvp_business_content_integration_factory/`
- `factory/react_ui_binding_factory/`
- `factory/react_ui_factory/`
- `factory/template_selection_integration_factory/`
- `factory/ui_library_factory/`

### npm scripts in working chain (56 seed scripts + chained deps)

- `build`
- `business-content-library:generate`
- `business-content:generate`
- `business-profile:generate`
- `client-build:generate`
- `client-cleanup:run`
- `client-contract-terms:generate`
- `client-data:generate`
- `client-data:integrate`
- `client-delivery-button:generate`
- `client-delivery-status:generate`
- `client-delivery:generate`
- `client-delivery:quality-gate`
- `client-demo-video:generate`
- `client-full-delivery:run`
- `client-notification:generate`
- `client-onboarding:generate`
- `client-one-command-delivery:generate`
- `client-order-history:generate`
- `client-package-download:generate`
- `client-package-from-react-mvp:generate`
- `client-package:generate`
- `client-pipeline:run`
- `client-profile:edit`
- `client-questionnaire-ui:generate`
- `client-readme:generate`
- `client-screenshots:generate`
- `client-temp-file-cleanup:generate`
- `client:deliver`
- `custom-domain:generate`
- `demo-video-binding:generate`
- `deploy-binding:generate`
- `deployment-choice:generate`
- `deployment-final-quality-gate`
- `deployment-validation:generate`
- `dev`
- `final-package-binding:generate`
- `final-v3:quality-gate`
- `full-v5:pipeline`
- `full-v5:quality-gate`
- `full-v6:pipeline`
- `full-v6:quality-gate`
- `github-delivery:generate`
- `knowledge-library-audit:generate`
- `knowledge-library-integration:generate`
- `lint`
- `mvp-assembly-intelligence:generate`
- `mvp-build-orchestrator:generate`
- `netlify-deploy:generate`
- `payment-integration:generate`
- `questionnaire:generate`
- `react-mvp-build-executor:generate`
- `react-mvp-business-content:integrate`
- `react-ui-binding:generate`
- `start`
- `template-selection-integration:generate`

### Artifact directories included (55)

- `artifacts/factory_output/business_content/`
- `artifacts/factory_output/business_content_library/`
- `artifacts/factory_output/business_profile/`
- `artifacts/factory_output/client_contract_terms/`
- `artifacts/factory_output/client_data/`
- `artifacts/factory_output/client_data_integration/`
- `artifacts/factory_output/client_delivery/`
- `artifacts/factory_output/client_delivery_button/`
- `artifacts/factory_output/client_delivery_final_quality_gate/`
- `artifacts/factory_output/client_delivery_status/`
- `artifacts/factory_output/client_demo_video/`
- `artifacts/factory_output/client_full_delivery/`
- `artifacts/factory_output/client_notification/`
- `artifacts/factory_output/client_onboarding/`
- `artifacts/factory_output/client_one_command_delivery/`
- `artifacts/factory_output/client_order_history/`
- `artifacts/factory_output/client_package/`
- `artifacts/factory_output/client_package_download/`
- `artifacts/factory_output/client_package_from_react_mvp/`
- `artifacts/factory_output/client_package_runtime_test/`
- `artifacts/factory_output/client_pipeline/`
- `artifacts/factory_output/client_production_build/`
- `artifacts/factory_output/client_questionnaire_ui/`
- `artifacts/factory_output/client_readme/`
- `artifacts/factory_output/client_screenshot/`
- `artifacts/factory_output/client_temp_file_cleanup/`
- `artifacts/factory_output/client_zip_package/`
- `artifacts/factory_output/custom_domain/`
- `artifacts/factory_output/demo_video_binding/`
- `artifacts/factory_output/deploy/`
- `artifacts/factory_output/deploy_binding/`
- `artifacts/factory_output/deploy_runtime/`
- `artifacts/factory_output/deployment_choice/`
- `artifacts/factory_output/deployment_final_quality_gate/`
- `artifacts/factory_output/deployment_validation/`
- `artifacts/factory_output/final_package/`
- `artifacts/factory_output/final_package_binding/`
- `artifacts/factory_output/final_v3_quality_gate/`
- `artifacts/factory_output/full_v5_final_quality_gate/`
- `artifacts/factory_output/full_v5_pipeline/`
- `artifacts/factory_output/full_v6_final_quality_gate/`
- `artifacts/factory_output/full_v6_pipeline/`
- `artifacts/factory_output/github_delivery/`
- `artifacts/factory_output/knowledge_library_audit/`
- `artifacts/factory_output/knowledge_library_integration/`
- `artifacts/factory_output/knowledge_router/`
- `artifacts/factory_output/mvp_assembly_intelligence/`
- `artifacts/factory_output/mvp_build_orchestrator/`
- `artifacts/factory_output/netlify_deploy/`
- `artifacts/factory_output/payment_integration/`
- `artifacts/factory_output/react_mvp/`
- `artifacts/factory_output/react_mvp_business_content_integration/`
- `artifacts/factory_output/react_ui/`
- `artifacts/factory_output/react_ui_binding/`
- `artifacts/factory_output/template_selection_integration/`

### Excluded from artifact copy (even if PASS exists elsewhere)

- `artifacts/factory_output/multi_business/` — excluded by requirement (multi-business experiments)
- `artifacts/factory_output/real_mvp/` — legacy materialization path (`real-mvp:*`), not in V5–V8 chain
- `node_modules/` inside any copied tree — excluded; run `npm install` after copy
- `public/artifacts/` — duplicate mirror of heavy factory outputs

---

## UNUSED FILES

### Factory modules excluded from core

- `factory/assembly_blueprint_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/assembly_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/demo_video_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/domain_transformation_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/i18n_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/idea_matching_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/module_assembly_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/module_library_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/multi_business_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/multi_ui_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/mvp_generation_pipeline/` — not referenced by working V5–V8 + V9 chain
- `factory/mvp_package_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/mvp_polish_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/mvp_structure_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/orchestrator/` — not referenced by working V5–V8 + V9 chain
- `factory/pattern_execution_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/pattern_ranker_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/pipeline_knowledge_integration/` — not referenced by working V5–V8 + V9 chain
- `factory/pricing_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/template_extraction_factory/` — not referenced by working V5–V8 + V9 chain
- `factory/ui_preview_factory/` — not referenced by working V5–V8 + V9 chain

### Legacy / commercial npm scripts not in working chain

Total unused root scripts: 77

Examples (full list in repo, excluded from core `scripts/`):

- `ai-test.mjs`
- `build-demo-video.mjs`
- `business-factory-utils.mjs`
- `business-ui-template.mjs`
- `capture-screenshots.mjs`
- `client-factory-utils.mjs`
- `client-ui-template.mjs`
- `demo-config.mjs`
- `demo-utils.mjs`
- `deployment-factory-utils.mjs`
- `generate-admin.mjs`
- `generate-api-gateway.mjs`
- `generate-app.mjs`
- `generate-assembly.mjs`
- `generate-auth.mjs`
- `generate-backend.mjs`
- `generate-billing.mjs`
- `generate-binding.mjs`
- `generate-business.mjs`
- `generate-client-factory.mjs`
- `generate-client-package.mjs`
- `generate-commercial-pricing.mjs`
- `generate-commercial-sales.mjs`
- `generate-commercial-subscription.mjs`
- `generate-commercial.mjs`
- `generate-crm.mjs`
- `generate-customer.mjs`
- `generate-dashboard.mjs`
- `generate-data.mjs`
- `generate-database.mjs`
- `generate-delivery.mjs`
- `generate-demo.mjs`
- `generate-deploy-scripts.mjs`
- `generate-deploy.mjs`
- `generate-deployment.mjs`
- `generate-domain.mjs`
- `generate-env.mjs`
- `generate-execution.mjs`
- `generate-factory-output.mjs`
- `generate-github-package.mjs`
- ... and 37 more

### Top-level paths excluded from core

- `*.tar.gz` — frozen archives (V5/V6/V7/V8 frozen packages)
- `backups/`
- `mock/`
- `video_work/`
- `artifacts/runtime_test/`
- `public/artifacts/`
- `.next/`
- `node_modules/` (root and nested — reinstall required)
- Legacy `output/MVP_STATUS_*` PASS files — pre-V5 commercial pipeline markers

---

## Rationale Summary

| Area | Kept | Excluded | Why |
|---|---|---|---|
| V5 build | mvp_assembly → react_mvp | idea_matching, pattern_ranker, pattern_execution | V5 manifest steps only |
| V6 content | business_content_* | domain_transformation, i18n_factory outputs | V6 pipeline manifest |
| V7 delivery | client_* delivery factories | demo_video_factory (legacy) | V7 quality gate modules list |
| V8 deploy | deployment_* + github_delivery | deploy scripts generator (commercial) | deployment_config github_only PASS path |
| CRM UI | `src/`, `public/showcase`, locales | `public/artifacts` mirror | Active V9 routes |
| Knowledge | `knowledge_library/`, integration + router factories | `pipeline_knowledge_integration`, `module_library_factory` | Static library is runtime source; router imports `knowledge_library_factory` + `ui_library_factory` validators |
| Data | `config/`, `input/` | — | Required by assembly + deployment + UI API |

---

## Post-copy setup

```bash
cd {CORE_ROOT}
npm install
npm run dev
```

To rerun the full deterministic pipeline from questionnaire:

```bash
npm run questionnaire:generate
npm run full-v5:pipeline
npm run full-v6:pipeline
npm run client-readme:generate
npm run client-screenshots:generate
npm run client-demo-video:generate
npm run client-build:generate
npm run client-package:generate
npm run client-delivery:quality-gate
npm run deployment-choice:generate
npm run github-delivery:generate
npm run deployment-validation:generate
npm run deployment-final-quality-gate
```
