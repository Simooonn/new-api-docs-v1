# OpenAPI generation (Ace Hub docs)

## Rule of thumb

| Concern | Canonical place |
|---|---|
| API base URL for curl / playground | `src/lib/api-base.ts` (`DEFAULT_OPENAPI_SERVER_URL`) |
| Runtime inject (if generated file lacks servers) | `src/lib/openapi.ts` |
| Write `servers` into generated JSON | `scripts/generate-openapi-from-http.ts` |
| Generated specs | `openapi/generated/**` — **do not hand-edit server URLs** |

- **Documentation site**: `https://docs.acetoken.top`
- **API / console host**: `https://www.acetoken.top`

fumadocs-openapi has **no** global `defaultServerUrl`. Missing `servers` becomes `{ url: '/' }` → the docs origin. That is why the base URL is pinned in code.

## Regenerate

```bash
# needs Apifox HTTP source access when regenerating from upstream
bun run generate:openapi
```

Optional override:

```bash
OPENAPI_SERVER_URL=https://www.acetoken.top bun run generate:openapi
```

## Collaboration / merge conflicts

1. Prefer changing **`src/lib/api-base.ts`** (or env), not dozens of JSON files.
2. After pulling, if OpenAPI changed, regenerate once and commit the whole generated tree.
3. Do not manually patch `servers` inside `openapi/generated/**` — the next generate will overwrite them.
4. Runtime still injects the correct host even if a stale generated file omits `servers`.

## Related scripts

- `bun run generate:openapi:schemas` — only rebuild `openapi/generated` JSON
- `bun run generate:openapi` — schemas + MDX API pages
