import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Footer } from './shared/components/general/footer/footer';
import { Navbar } from './shared/components/general/navbar/navbar';
import { CookieBanner } from './shared/components/general/cookie-banner/cookie-banner';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('aquarismo-app');

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
