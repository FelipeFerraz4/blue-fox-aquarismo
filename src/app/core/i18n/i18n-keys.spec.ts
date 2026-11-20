import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import en from '../../../assets/i18n/en.json';
import ptBR from '../../../assets/i18n/pt-BR.json';
import { SUPPORTED_LOCALES } from './locales';

/**
 * Guarda da i18n (roda no `npm test` e, portanto, no CI):
 * 1. todos os idiomas ativos têm exatamente as mesmas chaves;
 * 2. toda chave literal usada nos templates (`'SECAO.CHAVE' | translate`) e nos slides existe no pt-BR.
 */
interface Dict {
  [k: string]: string | Dict;
}
const FILES: Record<string, Dict> = { 'pt-BR': ptBR, en };

function flatten(d: Dict, prefix = ''): string[] {
  return Object.entries(d).flatMap(([k, v]) => (typeof v === 'string' ? [prefix + k] : flatten(v, `${prefix}${k}.`)));
}

function walk(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
  });
}

describe('i18n keys', () => {
  const base = new Set(flatten(ptBR));

  it('has a translation file for every supported locale', () => {
    for (const { code } of SUPPORTED_LOCALES) expect(FILES[code]).toBeDefined();
  });

  it.each(SUPPORTED_LOCALES.map((l) => l.code))('%s has the same keys as pt-BR', (code) => {
    const keys = new Set(flatten(FILES[code]));
    const missing = [...base].filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !base.has(k));
    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
  });

  it('every literal key used in templates and slides exists', () => {
    const appDir = join(__dirname, '..', '..');
    const used = new Set<string>();
    for (const file of [...walk(appDir, '.html'), ...walk(appDir, '.ts')]) {
      if (file.endsWith('.spec.ts')) continue;
      const src = readFileSync(file, 'utf8');
      // Prefixo seguido de `+` é chave montada (ex.: 'ABOUT.PILLAR' + n + '_TITLE'): não entra.
      for (const m of src.matchAll(/'([A-Z][A-Z0-9_]*(?:\.[A-Z0-9_]+)+)'(?!\s*\+)/g)) used.add(m[1]);
    }
    // Chaves montadas em tempo de execução (ex.: 'ABOUT.PILLAR' + n + '_TITLE') ficam fora desta checagem.
    const unknown = [...used].filter((k) => !base.has(k));
    expect(unknown).toEqual([]);
  });
});
