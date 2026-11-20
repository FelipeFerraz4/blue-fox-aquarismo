import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, UrlTree } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

import { LanguageService } from '../../../../core/i18n/language-service';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../../core/i18n/locales';

/**
 * Seletor de idioma (navbar): um link por idioma para a MESMA página no outro idioma
 * (/about ↔ /en/about), com `hreflang` (buscadores) e `aria-current` no idioma atual.
 * O nome do idioma vai no próprio idioma (`lang` no rótulo).
 */
@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  protected readonly locales = SUPPORTED_LOCALES;
  protected readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** UrlTree (e não string) para manter a query, ex.: /search?q=betta → /en/search?q=betta. */
  hrefFor(code: SupportedLocale): UrlTree {
    return this.router.parseUrl(this.language.localize(this.url(), code));
  }

  /** O link já navega; aqui só guardamos a preferência. */
  remember(code: SupportedLocale): void {
    this.language.remember(code);
  }
}
