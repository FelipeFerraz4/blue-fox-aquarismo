import { Component, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Footer } from './shared/components/general/footer/footer';
import { Navbar } from './shared/components/general/navbar/navbar';
import { CookieBanner } from './shared/components/general/cookie-banner/cookie-banner';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme/theme-service';
import { AccessibilityService } from './core/services/accessibility/accessibility-service';
import { A11yToolbar } from './shared/components/general/a11y-toolbar/a11y-toolbar';
import { LanguageService } from './core/i18n/language-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, CookieBanner, A11yToolbar, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('aquarismo-app');
  // Injetados aqui para valer desde o início (data-theme, data-contrast e escala da fonte).
  protected readonly theme = inject(ThemeService);
  protected readonly a11y = inject(AccessibilityService);
  protected readonly language = inject(LanguageService);
  private readonly document = inject(DOCUMENT);

  /** "Pular para o conteúdo": foca o <main> sem navegar. */
  skipToContent(event: Event): void {
    event.preventDefault();
    const main = this.document.getElementById('conteudo');
    main?.focus();
    main?.scrollIntoView();
  }

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0 });
        }, 0);
      });
    }
  }
}
