import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import en from '../../../assets/i18n/en.json';
import ptBR from '../../../assets/i18n/pt-BR.json';
import { DEFAULT_LOCALE, SupportedLocale } from './locales';

/**
 * Todos os idiomas vão no bundle (import estático, ~15 kB cada): o loader é síncrono, então o SSR e o
 * pré-render de /x e /en/x saem traduzidos já no primeiro render. Novo idioma = nova entrada aqui.
 */
const TRANSLATIONS: Record<SupportedLocale, TranslationObject> = {
  'pt-BR': ptBR as TranslationObject,
  en: en as TranslationObject,
};

@Injectable()
export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(TRANSLATIONS[lang as SupportedLocale] ?? TRANSLATIONS[DEFAULT_LOCALE]);
  }
}
