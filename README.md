# new-api-docs-v1

A Next.js documentation site for New API.

## Development

Run the development server:

```bash
bun install

bun dev
```

Open http://localhost:3004 with your browser to see the result.

## Build

Build the application for production:

```bash
bun run build
```

## Project Structure

| Path                      | Description                  |
| ------------------------- | ---------------------------- |
| `app/(home)`              | Landing page and home pages  |
| `app/[lang]/docs`         | Documentation pages (i18n)   |
| `app/api/search/route.ts` | Search API endpoint          |
| `content/docs/`           | Documentation content (MDX)  |
| `lib/source.ts`           | Content source configuration |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API

## OpenAPI API base URL

Curl samples and the API playground use the **Ace Hub API host**, not the docs site:

- Docs site: `https://docs.acetoken.top`
- API base: `https://www.acetoken.top` (override with `OPENAPI_SERVER_URL`)

Canonical config: `src/lib/api-base.ts`. See `openapi/README.md` for regenerate rules and conflict avoidance.

