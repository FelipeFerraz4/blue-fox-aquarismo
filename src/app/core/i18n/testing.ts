import { Provider } from '@angular/core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { DEFAULT_LOCALE } from './locales';
import { BundledTranslateLoader } from './translate-loader';

/** Traduções reais (pt-BR) para testes. Já vem no setup do Spectator; use em specs com TestBed puro. */
export function provideTestTranslations(): Provider[] {
  return provideTranslateService({
    loader: provideTranslateLoader(BundledTranslateLoader),
    fallbackLang: DEFAULT_LOCALE,
    lang: DEFAULT_LOCALE,
  });
}
