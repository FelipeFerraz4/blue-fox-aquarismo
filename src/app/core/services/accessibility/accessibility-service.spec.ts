import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { PLATFORM_ID } from '@angular/core';

import { AccessibilityService, FONT_SCALE_MAX, FONT_SCALE_MIN } from './accessibility-service';

class FakeUtterance {
  lang = '';
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}

describe('AccessibilityService', () => {
  const html = document.documentElement;
  const synth = { speak: jest.fn(), cancel: jest.fn(), getVoices: jest.fn(() => [{ lang: 'pt-BR' }]) };

  beforeEach(() => {
    localStorage.clear();
    html.removeAttribute('data-contrast');
    html.style.removeProperty('--a11y-font-scale');
    document.body.innerHTML = '';
    synth.speak.mockClear();
    synth.cancel.mockClear();
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true, writable: true });
  });

  describe('in the browser', () => {
    let spectator: SpectatorService<AccessibilityService>;
    const createService = createServiceFactory({
      service: AccessibilityService,
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    it('applies saved preferences', () => {
      localStorage.setItem('bf-font-scale', '1.25');
      localStorage.setItem('bf-contrast', 'high');
      spectator = createService();
      expect(spectator.service.fontScale()).toBe(1.25);
      expect(html.style.getPropertyValue('--a11y-font-scale')).toBe('1.25');
      expect(html.getAttribute('data-contrast')).toBe('high');
    });

    it('clamps the font scale and saves it', () => {
      spectator = createService();
      for (let i = 0; i < 10; i++) spectator.service.increaseFont();
      expect(spectator.service.fontScale()).toBe(FONT_SCALE_MAX);
      expect(spectator.service.canIncrease()).toBe(false);
      expect(localStorage.getItem('bf-font-scale')).toBe(String(FONT_SCALE_MAX));
      for (let i = 0; i < 10; i++) spectator.service.decreaseFont();
      expect(spectator.service.fontScale()).toBe(FONT_SCALE_MIN);
    });

    it('toggles high contrast and reset restores defaults', () => {
      spectator = createService();
      spectator.service.toggleContrast();
      spectator.service.increaseFont();
      expect(html.getAttribute('data-contrast')).toBe('high');
      spectator.service.reset();
      expect(spectator.service.isDefault()).toBe(true);
      expect(html.hasAttribute('data-contrast')).toBe(false);
      expect(localStorage.getItem('bf-font-scale')).toBeNull();
      expect(localStorage.getItem('bf-contrast')).toBeNull();
    });

    it('reads the article body when nothing is selected', () => {
      document.body.innerHTML = '<main><h1>Título</h1><article class="content"><p>Corpo  do artigo</p></article></main>';
      spectator = createService();
      spectator.service.toggleSpeech();
      const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
      expect(utterance.text).toBe('Corpo do artigo');
      expect(utterance.lang).toBe('pt-BR');
      expect(spectator.service.speaking()).toBe(true);
      utterance.onend?.();
      expect(spectator.service.speaking()).toBe(false);
    });

    it('stops when toggled while speaking', () => {
      document.body.innerHTML = '<main>Texto</main>';
      spectator = createService();
      spectator.service.toggleSpeech();
      spectator.service.toggleSpeech();
      expect(synth.cancel).toHaveBeenCalled();
      expect(spectator.service.speaking()).toBe(false);
    });
  });

  describe('on the server', () => {
    const createService = createServiceFactory({
      service: AccessibilityService,
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    it('uses defaults and does not touch the DOM', () => {
      localStorage.setItem('bf-contrast', 'high');
      const spectator = createService();
      expect(spectator.service.highContrast()).toBe(false);
      expect(spectator.service.speechSupported).toBe(false);
      expect(html.hasAttribute('data-contrast')).toBe(false);
    });
  });
});
