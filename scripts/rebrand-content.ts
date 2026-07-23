/**
 * Rebrand content: "New API" -> "Ace Hub" across docs content.
 *
 * Three processing layers:
 *   a. MDX body    - content/docs/**\/*.mdx, skipping fenced code blocks,
 *                    inline code spans, and bare URLs.
 *   b. Frontmatter - only `title:` / `description:` lines inside the leading
 *                    `---...---` block, rewritten as plain text (no YAML
 *                    parse/stringify, to avoid stripping BOM or reformatting
 *                    quoted/nested values on untouched files).
 *   c. meta.json   - content/docs/{en,zh,ja}/{guide/wiki,api,skills}/meta.json,
 *                    rewriting only the `"title"` / `"description"` string
 *                    values line-by-line (no JSON.parse/stringify, to avoid
 *                    reformatting arrays/indentation on untouched files).
 *
 * Never touched anywhere: fenced/inline code, URLs, file paths, lowercase
 * `new-api`, `NEW_API*` env names, the `calciumion/new-api` image name.
 *
 * Usage:
 *   bun scripts/rebrand-content.ts --dry-run   # report only, no writes
 *   bun scripts/rebrand-content.ts             # apply changes
 *
 * Idempotent: already-rebranded text contains no more "New API"/"NewAPI"
 * matches, so re-running produces zero further changes.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_ROOT = path.join(ROOT, 'content', 'docs');
const DRY_RUN = process.argv.includes('--dry-run');

const LOCALES = ['en', 'zh', 'ja'] as const;
const META_JSON_SUBDIRS = ['guide/wiki', 'api', 'skills'] as const;

const META_JSON_TARGETS = LOCALES.flatMap((locale) =>
  META_JSON_SUBDIRS.map((sub) => path.join(DOCS_ROOT, locale, sub, 'meta.json'))
);

interface LineChange {
  file: string;
  line: number;
  before: string;
  after: string;
}

const changes: LineChange[] = [];

// ---------------------------------------------------------------------------
// Brand text replacement (order matters: most specific pattern first)
// ---------------------------------------------------------------------------

function applyBrandReplacements(text: string): string {
  return text
    .replace(/New API's/g, "Ace Hub's")
    .replace(/New API/g, 'Ace Hub')
    .replace(/\bNewAPI\b/g, 'AceHub');
}

// Spans that must never be rewritten even when they contain brand text:
// inline code (`...`), bare URLs, markdown link/image destinations
// `](...)`, and JSX/HTML path-bearing attributes (src=/href=/document=/to=).
const PROTECTED_SPAN_RE =
  /`[^`\n]*`|https?:\/\/[^\s)\]}>"'`]+|\]\([^\s()]*\)|\b(?:src|href|document|to)=(?:\{"[^"]*"\}|"[^"]*"|'[^']*')/g;

function replaceOutsideProtectedSpans(line: string): string {
  let result = '';
  let lastIndex = 0;
  for (const match of line.matchAll(PROTECTED_SPAN_RE)) {
    const start = match.index!;
    result += applyBrandReplacements(line.slice(lastIndex, start));
    result += match[0];
    lastIndex = start + match[0].length;
  }
  result += applyBrandReplacements(line.slice(lastIndex));
  return result;
}

// ---------------------------------------------------------------------------
// Layer a + b: MDX files (body + frontmatter)
// ---------------------------------------------------------------------------

const FENCE_RE = /^\s*(`{3,}|~{3,})/;

function isFrontmatterDelimiter(line: string): boolean {
  // Handles an optional leading UTF-8 BOM on the very first line.
  return line === '---' || line === '﻿---';
}

function processMdx(relPath: string, original: string): string | null {
  const lines = original.split('\n');
  const out: string[] = new Array(lines.length);

  let inFrontmatter = false;
  let frontmatterClosed = false;
  let inFence = false;
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!frontmatterClosed && i === 0 && isFrontmatterDelimiter(line)) {
      inFrontmatter = true;
      out[i] = line;
      continue;
    }

    if (inFrontmatter) {
      if (line === '---') {
        inFrontmatter = false;
        frontmatterClosed = true;
        out[i] = line;
        continue;
      }
      if (/^(title|description):/.test(line)) {
        const rewritten = applyBrandReplacements(line);
        if (rewritten !== line) {
          changes.push({ file: relPath, line: i + 1, before: line, after: rewritten });
          changed = true;
        }
        out[i] = rewritten;
      } else {
        out[i] = line;
      }
      continue;
    }

    // Body: track fenced code blocks; never rewrite inside them.
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      out[i] = line;
      continue;
    }
    if (inFence) {
      out[i] = line;
      continue;
    }

    const rewritten = replaceOutsideProtectedSpans(line);
    if (rewritten !== line) {
      changes.push({ file: relPath, line: i + 1, before: line, after: rewritten });
      changed = true;
    }
    out[i] = rewritten;
  }

  return changed ? out.join('\n') : null;
}

// ---------------------------------------------------------------------------
// Layer c: meta.json (line-level, title/description string values only)
// ---------------------------------------------------------------------------

const META_FIELD_LINE_RE = /^(\s*"(?:title|description)"\s*:\s*")(.*?)("\s*,?\s*)$/;

function processMetaJson(relPath: string, original: string): string | null {
  const lines = original.split('\n');
  let changed = false;
  const out = lines.map((line, idx) => {
    const m = line.match(META_FIELD_LINE_RE);
    if (!m) return line;
    const [, prefix, value, suffix] = m;
    const rewrittenValue = applyBrandReplacements(value);
    if (rewrittenValue === value) return line;
    const rewritten = `${prefix}${rewrittenValue}${suffix}`;
    changes.push({ file: relPath, line: idx + 1, before: line, after: rewritten });
    changed = true;
    return rewritten;
  });
  return changed ? out.join('\n') : null;
}

// ---------------------------------------------------------------------------
// File discovery + main
// ---------------------------------------------------------------------------

async function walkMdxFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkMdxFiles(full)));
    } else if (entry.isFile() && full.endsWith('.mdx')) {
      out.push(full);
    }
  }
  return out;
}

function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

async function main() {
  const mdxFiles = await walkMdxFiles(DOCS_ROOT);
  mdxFiles.sort();

  const touchedFiles: string[] = [];

  for (const absPath of mdxFiles) {
    const relPath = toPosix(path.relative(ROOT, absPath));
    const original = await readFile(absPath, 'utf8');
    const updated = processMdx(relPath, original);
    if (updated !== null) {
      touchedFiles.push(relPath);
      if (!DRY_RUN) {
        await writeFile(absPath, updated, 'utf8');
      }
    }
  }

  for (const absPath of META_JSON_TARGETS) {
    const relPath = toPosix(path.relative(ROOT, absPath));
    let original: string;
    try {
      original = await readFile(absPath, 'utf8');
    } catch {
      console.warn(`WARN: expected meta.json not found, skipping: ${relPath}`);
      continue;
    }
    const updated = processMetaJson(relPath, original);
    if (updated !== null) {
      touchedFiles.push(relPath);
      if (!DRY_RUN) {
        await writeFile(absPath, updated, 'utf8');
      }
    }
  }

  console.log(`${DRY_RUN ? '[dry-run] ' : ''}Rebrand scan complete.`);
  console.log(`Files with changes: ${touchedFiles.length}`);
  console.log(`Total line changes: ${changes.length}`);

  if (DRY_RUN) {
    for (const c of changes) {
      console.log(`\n${c.file}:${c.line}`);
      console.log(`  - ${c.before}`);
      console.log(`  + ${c.after}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
