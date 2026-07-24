/**
 * Ace Hub API base URL for OpenAPI docs (curl samples / playground).
 *
 * fumadocs-openapi has no global defaultServerUrl. If a document omits
 * `servers`, it falls back to `{ url: '/' }` which becomes the docs site
 * origin (docs.acetoken.top). Always pin the real API host here.
 *
 * Override: OPENAPI_SERVER_URL=https://www.acetoken.top
 *
 * Conventions:
 * - Change the default only in this file (or via env).
 * - Do not hand-edit openapi/generated/** for server URLs.
 * - Regenerate with: bun run generate:openapi
 * - docs.acetoken.top is the documentation site; www.acetoken.top is the API/console.
 */
export const DEFAULT_OPENAPI_SERVER_URL = 'https://www.acetoken.top';

export function getOpenApiServerUrl(): string {
  const fromEnv = process.env.OPENAPI_SERVER_URL?.trim();
  return fromEnv || DEFAULT_OPENAPI_SERVER_URL;
}

export function ensureOpenApiServers<T extends { servers?: Array<{ url?: string; description?: string }> }>(
  doc: T,
  apiBaseUrl: string = getOpenApiServerUrl()
): T {
  const servers = Array.isArray(doc.servers) ? doc.servers : [];
  const hasApiHost = servers.some(
    (s) => typeof s?.url === 'string' && s.url.includes('www.acetoken.top')
  );
  if (!hasApiHost) {
    doc.servers = [{ url: apiBaseUrl, description: 'Ace Hub API' }];
  }
  return doc;
}
