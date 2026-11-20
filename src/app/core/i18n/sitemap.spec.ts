import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { localizeUrl } from './language-service';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';

/**
 * Guarda do public/sitemap.xml (gerado por `npm run sitemap`): cada página aparece em todos os
 * idiomas ativos, com hreflang de cada versão e x-default, e nada privado entra.
 */
const ORIGIN = 'https://bluefoxaquarismo.space';
const xml = readFileSync(join(__dirname, '../../../../public/sitemap.xml'), 'utf8');
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const loc = (entry: string) => /<loc>([^<]+)<\/loc>/.exec(entry)![1];
const alternates = (entry: string) =>
  Object.fromEntries([...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
const pathOf = (url: string) => url.slice(ORIGIN.length) || '/';

describe('sitemap.xml', () => {
  const locs = entries.map(loc);

  it('lists every page in every active language', () => {
    const defaults = locs.filter((u) => localizeUrl(pathOf(u), DEFAULT_LOCALE) === pathOf(u));
    expect(defaults.length).toBeGreaterThan(0);
    for (const u of defaults) {
      for (const l of SUPPORTED_LOCALES) {
        expect(locs).toContain(ORIGIN + localizeUrl(pathOf(u), l.code));
      }
    }
    expect(locs).toHaveLength(defaults.length * SUPPORTED_LOCALES.length);
  });

  it('declares hreflang alternates and x-default on each entry', () => {
    for (const entry of entries) {
      const alt = alternates(entry);
      const path = pathOf(loc(entry));
      for (const l of SUPPORTED_LOCALES) {
        expect(alt[l.code]).toBe(ORIGIN + localizeUrl(path, l.code));
      }
      expect(alt['x-default']).toBe(alt[DEFAULT_LOCALE]);
    }
  });

  it('never lists private or login-only pages', () => {
    expect(locs.filter((u) => /\/(admin|account)(\/|$)/.test(u))).toEqual([]);
  });
});
