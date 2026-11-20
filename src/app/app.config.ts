import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth/auth-service';
import { tenantInterceptor } from './core/interceptors/tenant.interceptor';
import { ssrRetryInterceptor } from './core/interceptors/ssr-retry.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { BundledTranslateLoader } from './core/i18n/translate-loader';
import { DEFAULT_LOCALE } from './core/i18n/locales';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR',
    },

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([tenantInterceptor, authInterceptor, ssrRetryInterceptor])
    ),

    // i18n: pt-BR no bundle (SSR/pré-render prontos), outros idiomas sob demanda; ver core/i18n.
    provideTranslateService({
      loader: provideTranslateLoader(BundledTranslateLoader),
      fallbackLang: DEFAULT_LOCALE,
      lang: DEFAULT_LOCALE,
    }),

    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.init();
    }),
  ],
};