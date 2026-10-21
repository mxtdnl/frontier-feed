/**
 * Facilitator guide (Session 19 Part E; FEED since Session R4): docs/facilitator-guide/guide.html, its committed PDF,
 * and docs/RUNBOOK.md. The guide must not go stale the way the briefing deck's card list did: every card, route, key
 * and command appears in it. Rendering is checked by `npm run guide:pdf` (Chromium is not available in CI); this test
 * checks the committed output.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findViolations, type Violation } from '../../scripts/lib/copy-rules';
import { GUIDE_MAX_BYTES, GUIDE_PAGES, pdfPageCount } from '../../scripts/lib/guide';
import { CARDS } from '../../src/engine';
import { COMMAND_HELP } from '../../src/ui/commands';
import { KEY_BINDINGS } from '../../src/ui/keys';
import { CARD_LABEL } from '../../src/ui/vocab';

const DIR = 'docs/facilitator-guide';
const html = readFileSync(join(DIR, 'guide.html'), 'utf8');
const text = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const runbook = readFileSync('docs/RUNBOOK.md', 'utf8');
const DOCS = [
  ['guide.html', text],
  ['RUNBOOK.md', runbook],
] as const;

/**
 * Copy-rule hits, except that the facilitator materials may name Meta on a line that describes the case as
 * allegations (docs/RESKIN.md, guardrails). Every other real platform name stays banned.
 */
function violations(doc: string): Violation[] {
  const lines = doc.split('\n');
  return findViolations(doc, { allowNonTelegraphing: true }).filter(
    (v) => !(v.rule === 'real-platform' && v.term === 'Meta' && /allegation/i.test(lines[v.line - 1] ?? '')),
  );
}

describe('the facilitator guide covers the app as built', () => {
  it('names every card by its ID and its display label', () => {
    for (const card of CARDS) {
      expect(text, card).toMatch(new RegExp(`\\b${card}\\b`));
      expect(text, CARD_LABEL[card]).toMatch(new RegExp(`\\b${CARD_LABEL[card]}\\b`));
    }
  });

  it('lists every route in spec §3', () => {
    const spec = readFileSync('docs/spec.md', 'utf8');
    const section = spec.slice(spec.indexOf('## 3. Roles and routes'), spec.indexOf('## 4.'));
    const routes = [...section.matchAll(/^\| `(#\/[^`]*)`/gm)].map((m) => m[1] ?? '');
    expect(routes.length).toBeGreaterThanOrEqual(8);
    for (const r of routes) expect(text, r).toContain(r);
  });

  it('lists every key with its Shift+letter alternative', () => {
    for (const b of KEY_BINDINGS) {
      expect(text, b.fKey).toMatch(new RegExp(`\\b${b.fKey}\\b`));
      expect(text, `Shift+${b.letter}`).toContain(`Shift+${b.letter}`);
    }
    expect(text).toContain('Esc');
  });

  it('lists every projector command, in the guide and the runbook', () => {
    for (const { mnemonic } of COMMAND_HELP) {
      expect(text, mnemonic).toContain(`<code>${mnemonic}</code>`);
      expect(runbook, mnemonic).toContain(`\`${mnemonic}\``);
    }
  });
});

describe('the facilitator guide and runbook follow the copy and design rules', () => {
  it('use no §15.2 term, no emoji and no real platform except Meta as allegations (the §15.3 words are allowed: facilitator-only)', () => {
    for (const [name, doc] of DOCS) expect(violations(doc), name).toEqual([]);
  });

  it('name Meta, and only beside the word "allegations"', () => {
    for (const [name, doc] of DOCS) {
      expect(doc, name).toMatch(/\bMeta\b/);
      for (const line of doc.split('\n').filter((l) => /\bMeta\b/.test(l))) expect(line, name).toMatch(/allegation/i);
    }
  });

  it('carry no FRONTIER-only names (Session R4)', () => {
    const stale = [/\bOFS\b/, /Office of Frontier Systems/, /frontier-sim\b/, /github\.io\/frontier\//, /\bINCID\b/, /PACT RECORD/, /\bPACTS tab/, /`PACT`|<code>PACT<\/code>/, /Quarry Labs|\bQRRY\b|\bTLWN\b/, /\bAI (firm|company|industry|safety)/, /frontier deployments/, /FRONTIER-facilitator-guide/];
    for (const [name, doc] of DOCS) for (const re of stale) expect(doc, `${name}: ${re}`).not.toMatch(re);
  });

  it('uses only colours from src/ui/tokens.css', () => {
    const tokens = new Set([...readFileSync('src/ui/tokens.css', 'utf8').matchAll(/#[0-9A-Fa-f]{6}\b/g)].map((m) => m[0].toUpperCase()));
    const used = [...html.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)].map((m) => m[0].toUpperCase());
    expect(used.length).toBeGreaterThan(0);
    for (const c of used) expect(tokens.has(c), c).toBe(true);
  });

  it('has no rounded corners, gradients or shadows', () => {
    expect(html).not.toMatch(/border-radius:\s*[1-9]/);
    expect(html).not.toMatch(/gradient\(|box-shadow|text-shadow|filter:\s*blur/);
  });

  it('loads nothing from the network', () => {
    expect(html).not.toMatch(/(src|href)=["']https?:/);
    expect(html).not.toMatch(/url\(['"]?https?:/);
    expect(html).not.toMatch(/@import/);
  });
});

describe('the committed guide files', () => {
  it('every image the guide shows is committed, and every committed image is used', () => {
    const srcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1] ?? '');
    expect(srcs.length).toBeGreaterThan(15);
    for (const s of srcs) expect(existsSync(join(DIR, s)), s).toBe(true);
    for (const f of readdirSync(join(DIR, 'img'))) expect(srcs, f).toContain(`img/${f}`);
  });

  it('the PDF exists, has the expected page count and stays under 10 MB', () => {
    const pdf = join(DIR, 'FEED-facilitator-guide.pdf');
    expect(existsSync(pdf)).toBe(true);
    const pages = pdfPageCount(readFileSync(pdf));
    expect(pages).toBeGreaterThanOrEqual(GUIDE_PAGES.min);
    expect(pages).toBeLessThanOrEqual(GUIDE_PAGES.max);
    expect(statSync(pdf).size).toBeLessThan(GUIDE_MAX_BYTES);
  });

  it('is never linked from the app or part of the build', () => {
    const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    for (const f of [...walk('src'), 'index.html', 'vite.config.ts']) expect(readFileSync(f, 'utf8'), f).not.toMatch(/facilitator-guide/);
  });
});
