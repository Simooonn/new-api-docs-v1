# AGENTS.md — new-api-docs-v1

## OpenAPI base URL

- Canonical default: `src/lib/api-base.ts` → `https://www.acetoken.top`
- Runtime pin: `src/lib/openapi.ts` (injects `servers` if missing)
- Generator: `scripts/generate-openapi-from-http.ts` (writes `servers` into generated JSON)
- **Do not** hand-edit `servers` in `openapi/generated/**`; run `bun run generate:openapi`
- `docs.acetoken.top` = documentation site only; API examples must use `www.acetoken.top`
- Override: `OPENAPI_SERVER_URL`

See `openapi/README.md` for full regenerate / merge guidance.
