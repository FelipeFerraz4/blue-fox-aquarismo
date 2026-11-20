import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SupportedLocale, isSupportedLocale, localeInfo } from './locales';

/**
 * Idioma da interface. O servidor (SSR/pré-render) sempre renderiza no padrão (pt-BR); no navegador,
 * a escolha salva em `bf-lang` é aplicada logo no início (o script do index.html já ajusta o `lang`
 * do <html> antes do Angular). Os artigos e textos legais continuam em pt-BR (conteúdo editorial).
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly current = signal<SupportedLocale>(DEFAULT_LOCALE);
  /** Locale para formatar datas e números (pt-BR, en-US). */
  readonly dateLocale = computed(() => localeInfo(this.current()).dateLocale);
  readonly isDefault = computed(() => this.current() === DEFAULT_LOCALE);

  constructor() {
    this.translate.setFallbackLang(DEFAULT_LOCALE);
    this.translate.use(DEFAULT_LOCALE);
    if (this.isBrowser) {
      const saved = this.read();
      if (saved !== DEFAULT_LOCALE) this.set(saved, false);
    }
  }

  /** Troca o idioma (carrega o arquivo se preciso) e, por padrão, guarda a escolha. */
  set(lang: SupportedLocale, persist = true): void {
    this.translate.use(lang).subscribe({
      next: () => {
        this.current.set(lang);
        if (this.isBrowser) this.document.documentElement.lang = lang;
      },
      error: () => this.translate.use(DEFAULT_LOCALE),
    });
    if (persist && this.isBrowser) {
      try {
        if (lang === DEFAULT_LOCALE) localStorage.removeItem(LOCALE_STORAGE_KEY);
        else localStorage.setItem(LOCALE_STORAGE_KEY, lang);
      } catch {
        /* navegação privada: vale só nesta aba */
      }
    }
  }

  private read(): SupportedLocale {
    try {
      const v = localStorage.getItem(LOCALE_STORAGE_KEY);
      return isSupportedLocale(v) ? v : DEFAULT_LOCALE;
    } catch {
      return DEFAULT_LOCALE;
    }
  }
}
