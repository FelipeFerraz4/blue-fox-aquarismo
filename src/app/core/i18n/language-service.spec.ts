import { EnvironmentInjector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language-service';
import { LocalDatePipe } from './local-date.pipe';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt-BR';
  });

  describe('in the browser', () => {
    const createService = createServiceFactory({
      service: LanguageService,
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    it('starts in pt-BR', () => {
      const s = createService();
      expect(s.service.current()).toBe('pt-BR');
      expect(s.inject(TranslateService).instant('NAV.ABOUT')).toBe('Sobre');
    });

    it('switches to English, loads the file, saves the choice and sets <html lang>', async () => {
      const s = createService();
      s.service.set('en');
      await flush();
      expect(s.service.current()).toBe('en');
      expect(s.inject(TranslateService).instant('NAV.ABOUT')).toBe('About');
      expect(localStorage.getItem('bf-lang')).toBe('en');
      expect(document.documentElement.lang).toBe('en');
    });

    it('applies the saved choice on start and clears it when back to the default', async () => {
      localStorage.setItem('bf-lang', 'en');
      const s = createService();
      await flush();
      expect(s.service.current()).toBe('en');
      s.service.set('pt-BR');
      await flush();
      expect(localStorage.getItem('bf-lang')).toBeNull();
    });

    it('formats dates in the interface language', async () => {
      const s = createService();
      const date = runInInjectionContext(s.inject(EnvironmentInjector), () => new LocalDatePipe());
      expect(date.transform('2026-10-19T00:00:00.000Z')).toBe('19 de outubro de 2026');
      s.service.set('en');
      await flush();
      expect(date.transform('2026-10-19T00:00:00.000Z')).toBe('October 19, 2026');
      expect(date.transform(null)).toBe('');
    });
  });

  describe('on the server', () => {
    const createService = createServiceFactory({
      service: LanguageService,
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    it('always renders the default language', () => {
      localStorage.setItem('bf-lang', 'en');
      const s = createService();
      expect(s.service.current()).toBe('pt-BR');
    });
  });
});
