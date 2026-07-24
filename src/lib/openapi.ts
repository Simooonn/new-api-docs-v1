import { createOpenAPI } from 'fumadocs-openapi/server';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

async function walkJsonFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    let entries: Array<{ name: string; isDirectory: boolean; isFile: boolean }>;
    try {
      entries = (await readdir(current, { withFileTypes: true })) as any;
    } catch {
      return;
    }
    for (const e of entries as any) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) {
        const rel = path.relative(process.cwd(), full);
        out.push(rel.split(path.sep).join('/'));
      }
    }
  }
  await walk(dir);
  return out;
}

export const openapi = createOpenAPI({
  // Set proxy URL to resolve CORS issues
  proxyUrl: '/api/proxy',
  // Always load generated per-endpoint OpenAPI files (clean single source of truth)
  async input() {
    const files = await walkJsonFiles('./openapi/generated');
    if (files.length === 0) {
      throw new Error(
        'No generated OpenAPI files found in ./openapi/generated. Run: bun run generate:openapi'
      );
    }
    const apiBaseUrl =
      process.env.OPENAPI_SERVER_URL?.trim() || 'https://www.acetoken.top';
    const entries = await Promise.all(
      files.map(async (p) => {
        const raw = await readFile(p, 'utf8');
        const doc = JSON.parse(raw) as {
          servers?: Array<{ url?: string; description?: string }>;
          [key: string]: unknown;
        };
        // Ensure curl/playground samples target the Ace Hub API host, not the docs site.
        const servers = Array.isArray(doc.servers) ? doc.servers : [];
        const hasApiHost = servers.some(
          (s) => typeof s?.url === 'string' && s.url.includes('www.acetoken.top')
        );
        if (!hasApiHost) {
          doc.servers = [{ url: apiBaseUrl, description: 'Ace Hub API' }];
        }
        return [p, doc] as const;
      })
    );
    return Object.fromEntries(entries);
  },
});
