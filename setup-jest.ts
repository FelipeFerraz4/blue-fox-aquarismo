import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { defineGlobalsInjections } from '@ngneat/spectator';

import { provideTestTranslations } from './src/app/core/i18n/testing';

setupZoneTestEnv();

// i18n em todos os testes do Spectator: pt-BR real (os testes que conferem texto continuam valendo).
defineGlobalsInjections({
  providers: [provideTestTranslations()],
});
// jsdom não implementa matchMedia (usado pelo ThemeService). Specs podem sobrescrever.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}
