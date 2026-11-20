import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { LanguageService, localizeUrl } from '../../i18n/language-service';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, localeInfo } from '../../i18n/locales';

export const SITE_ORIGIN = 'https://bluefoxaquarismo.space';

/**
 * Metadados de SEO da página (título, descrição, Open Graph, canonical e hreflang).
 * Roda também no servidor: tudo entra no HTML pré-renderizado, que é o que os buscadores leem.
 *
 * `url` é o endereço da página (em qualquer idioma). A partir dele saem o canonical no idioma atual,
 * os `<link rel="alternate" hreflang>` de cada idioma ativo e o `x-default` (pt-BR).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  updateMetadata(data: { title: string; description: string; image?: string; url: string; type?: string }) {
    const { title, description, image, url, type = 'article' } = data;
    const lang = this.language.current();
    const path = this.pathOf(url);
    const canonical = this.absolute(localizeUrl(path, lang));

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image || '' });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: localeInfo(lang).ogLocale });
    this.meta.removeTag("property='og:locale:alternate'");
    for (const l of SUPPORTED_LOCALES.filter((x) => x.code !== lang)) {
      this.meta.addTag({ property: 'og:locale:alternate', content: l.ogLocale });
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setLink('canonical', canonical);
    this.setAlternates(path);
  }

  /** Caminho (com query) de uma URL absoluta ou relativa: "https://.../en/about?x=1" → "/en/about?x=1". */
  private pathOf(url: string): string {
    try {
      const u = new URL(url, SITE_ORIGIN);
      return `${u.pathname}${u.search}`;
    } catch {
      return '/';
    }
  }

  private absolute(path: string): string {
    return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
  }

  private setLink(rel: string, href: string) {
    let link = this.document.head.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** Um `<link rel="alternate" hreflang>` por idioma + `x-default` (versão padrão). */
  private setAlternates(path: string) {
    this.document.head.querySelectorAll("link[rel='alternate'][hreflang]").forEach((el) => el.remove());
    const add = (hreflang: string, href: string) => {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.document.head.appendChild(link);
    };
    for (const l of SUPPORTED_LOCALES) add(l.code, this.absolute(localizeUrl(path, l.code)));
    add('x-default', this.absolute(localizeUrl(path, DEFAULT_LOCALE)));
  }
}
