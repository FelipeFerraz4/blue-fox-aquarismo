import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, from, map, of } from 'rxjs';

import ptBR from '../../../assets/i18n/pt-BR.json';
import { DEFAULT_LOCALE, SupportedLocale } from './locales';

/**
 * O idioma padrão vai no bundle (import estático): SSR e pré-render saem traduzidos já no
 * primeiro render, sem requisição nem chave aparecendo. Os outros idiomas viram chunks carregados
 * só quando o visitante escolhe (import dinâmico). Novo idioma = nova entrada em LAZY_LOCALES.
 */
const LAZY_LOCALES: Partial<Record<SupportedLocale, () => Promise<{ default: TranslationObject }>>> = {
  en: () => import('../../../assets/i18n/en.json'),
};

@Injectable()
export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    if (lang === DEFAULT_LOCALE) return of(ptBR as TranslationObject);
    const load = LAZY_LOCALES[lang as SupportedLocale];
    if (!load) return of(ptBR as TranslationObject);
    return from(load()).pipe(map((m) => m.default));
  }
}
