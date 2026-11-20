import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  SupportedLocale,
  isSupportedLocale,
  localeInfo,
} from './locales';

/** Prefixo de URL de cada idioma (o padrão fica na raiz). */
export function localePrefix(lang: SupportedLocale): string {
  return lang === DEFAULT_LOCALE ? '' : `/${localeInfo(lang).urlPrefix}`;
}

/** Idioma de uma URL: "/en/about" → en; "/about" → pt-BR. */
export function localeFromUrl(url: string): SupportedLocale {
  const first = url.split(/[?#]/)[0].split('/').filter(Boolean)[0];
  return SUPPORTED_LOCALES.find((l) => l.code !== DEFAULT_LOCALE && l.urlPrefix === first)?.code ?? DEFAULT_LOCALE;
}

/** Caminho sem o prefixo de idioma: "/en/about?x=1" → "/about?x=1"; "/en" → "/". */
export function stripLocale(url: string): string {
  const lang = localeFromUrl(url);
  if (lang === DEFAULT_LOCALE) return url || '/';
  const rest = url.slice(localePrefix(lang).length);
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/** Mesmo caminho no idioma pedido: ("/about", en) → "/en/about"; ("/", en) → "/en". */
export function localizeUrl(path: string, lang: SupportedLocale): string {
  const clean = stripLocale(path.startsWith('/') ? path : `/${path}`);
  const prefix = localePrefix(lang);
  if (!prefix) return clean;
  return clean === '/' ? prefix : `${prefix}${clean.startsWith('/?') ? clean.slice(1) : clean}`;
}

/**
 * Idioma da interface, definido pela URL (/x = pt-BR, /en/x = inglês). Cada idioma tem páginas
 * próprias, pré-renderizadas no idioma certo. Trocar de idioma = navegar para a URL equivalente.
 * A escolha fica em `bf-lang` e só é usada para levar quem entra pela home ao idioma preferido.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private redirectChecked = false;

  readonly current = signal<SupportedLocale>(DEFAULT_LOCALE);
  /** Locale para formatar datas e números (pt-BR, en-US). */
  readonly dateLocale = computed(() => localeInfo(this.current()).dateLocale);
  readonly isDefault = computed(() => this.current() === DEFAULT_LOCALE);

  constructor() {
    this.translate.setFallbackLang(DEFAULT_LOCALE);
    this.apply(localeFromUrl(this.router.url === '/' ? this.document.location?.pathname ?? '/' : this.router.url));
    // O idioma muda no início da navegação: a página já renderiza (inclusive no SSR) no idioma certo.
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.preferredRedirect(e.url);
        this.apply(localeFromUrl(e.url));
      }
    });
  }

  /** Caminho no idioma atual (ou no pedido): usado pelos links internos. */
  localize(path: string, lang: SupportedLocale = this.current()): string {
    return localizeUrl(path, lang);
  }

  /** Guarda o idioma preferido (sem navegar). */
  remember(lang: SupportedLocale): void {
    this.store(lang);
  }

  /** Vai para a mesma página no outro idioma e guarda a escolha. */
  switchTo(lang: SupportedLocale): void {
    this.store(lang);
    if (lang === this.current()) return;
    void this.router.navigateByUrl(localizeUrl(this.router.url, lang));
  }

  private apply(lang: SupportedLocale): void {
    if (lang === this.current() && this.translate.getCurrentLang() === lang) return;
    // Os arquivos de tradução estão no bundle (loader síncrono): a troca vale já neste render.
    this.translate.use(lang);
    this.current.set(lang);
    this.document.documentElement.setAttribute('lang', lang);
  }

  /** Quem entra pela home (/) com outro idioma salvo vai para a home desse idioma. Só uma vez. */
  private preferredRedirect(url: string): void {
    if (!this.isBrowser || this.redirectChecked) return;
    this.redirectChecked = true;
    const saved = this.read();
    if (saved !== DEFAULT_LOCALE && url.split(/[?#]/)[0] === '/') {
      queueMicrotask(() => void this.router.navigateByUrl(localizeUrl(url, saved), { replaceUrl: true }));
    }
  }

  private store(lang: SupportedLocale): void {
    if (!this.isBrowser) return;
    try {
      if (lang === DEFAULT_LOCALE) localStorage.removeItem(LOCALE_STORAGE_KEY);
      else localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    } catch {
      /* navegação privada: vale só nesta aba */
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
