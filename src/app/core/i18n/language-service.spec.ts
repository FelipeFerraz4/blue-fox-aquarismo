import { Component, EnvironmentInjector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService, localeFromUrl, localizeUrl, stripLocale } from './language-service';
import { LocalDatePipe } from './local-date.pipe';
import { LocalizePipe } from './localize.pipe';

@Component({ template: '' })
class Blank {}

const routes = [
  { path: 'en', children: [{ path: '**', component: Blank }] },
  { path: '**', component: Blank },
];

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('URL helpers', () => {
  it('reads the language from the URL prefix', () => {
    expect(localeFromUrl('/en/about')).toBe('en');
    expect(localeFromUrl('/en')).toBe('en');
    expect(localeFromUrl('/en?x=1')).toBe('en');
    expect(localeFromUrl('/about')).toBe('pt-BR');
    expect(localeFromUrl('/english-tips')).toBe('pt-BR');
  });

  it('strips and adds the prefix', () => {
    expect(stripLocale('/en/about?x=1')).toBe('/about?x=1');
    expect(stripLocale('/en')).toBe('/');
    expect(localizeUrl('/about', 'en')).toBe('/en/about');
    expect(localizeUrl('/', 'en')).toBe('/en');
    expect(localizeUrl('/?q=1', 'en')).toBe('/en?q=1');
    expect(localizeUrl('/en/about', 'pt-BR')).toBe('/about');
    expect(localizeUrl('about', 'pt-BR')).toBe('/about');
  });
});

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt-BR';
  });

  describe('in the browser', () => {
    const createService = createServiceFactory({
      service: LanguageService,
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideRouter(routes)],
    });

    it('starts in pt-BR', () => {
      const s = createService();
      expect(s.service.current()).toBe('pt-BR');
      expect(s.inject(TranslateService).instant('NAV.ABOUT')).toBe('Sobre');
    });

    it('follows the URL: /en/... is English and sets <html lang>', async () => {
      const s = createService();
      await s.inject(Router).navigateByUrl('/en/about');
      expect(s.service.current()).toBe('en');
      expect(s.inject(TranslateService).instant('NAV.ABOUT')).toBe('About');
      expect(document.documentElement.lang).toBe('en');
      expect(s.service.localize('/contact')).toBe('/en/contact');

      await s.inject(Router).navigateByUrl('/about');
      expect(s.service.current()).toBe('pt-BR');
      expect(document.documentElement.lang).toBe('pt-BR');
    });

    it('switchTo navigates to the same page in the other language and saves the choice', async () => {
      const s = createService();
      const router = s.inject(Router);
      await router.navigateByUrl('/about');
      s.service.switchTo('en');
      await flush();
      expect(router.url).toBe('/en/about');
      expect(localStorage.getItem('bf-lang')).toBe('en');

      s.service.switchTo('pt-BR');
      await flush();
      expect(router.url).toBe('/about');
      expect(localStorage.getItem('bf-lang')).toBeNull();
    });

    it('takes who enters by the home page to the saved language', async () => {
      localStorage.setItem('bf-lang', 'en');
      const s = createService();
      const router = s.inject(Router);
      await router.navigateByUrl('/');
      await flush();
      await flush();
      expect(router.url).toBe('/en');
      expect(s.service.current()).toBe('en');
    });

    it('does not redirect deep links', async () => {
      localStorage.setItem('bf-lang', 'en');
      const s = createService();
      const router = s.inject(Router);
      await router.navigateByUrl('/about');
      await flush();
      expect(router.url).toBe('/about');
    });

    it('formats dates and localizes links in the interface language', async () => {
      const s = createService();
      const injector = s.inject(EnvironmentInjector);
      const date = runInInjectionContext(injector, () => new LocalDatePipe());
      const localize = runInInjectionContext(injector, () => new LocalizePipe());
      expect(date.transform('2026-10-19T00:00:00.000Z')).toBe('19 de outubro de 2026');
      expect(localize.transform('/about')).toBe('/about');
      await s.inject(Router).navigateByUrl('/en');
      expect(date.transform('2026-10-19T00:00:00.000Z')).toBe('October 19, 2026');
      expect(localize.transform('/about')).toBe('/en/about');
      expect(date.transform(null)).toBe('');
    });
  });

  describe('on the server', () => {
    const createService = createServiceFactory({
      service: LanguageService,
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }, provideRouter(routes)],
    });

    it('renders the language of the URL and ignores the saved choice', async () => {
      localStorage.setItem('bf-lang', 'en');
      const s = createService();
      const router = s.inject(Router);
      await router.navigateByUrl('/');
      await flush();
      expect(router.url).toBe('/');
      expect(s.service.current()).toBe('pt-BR');
      await router.navigateByUrl('/en/about');
      expect(s.service.current()).toBe('en');
    });
  });
});
