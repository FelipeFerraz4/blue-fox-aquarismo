import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { PLATFORM_ID } from '@angular/core';

import { ThemeService } from './theme-service';

type ChangeListener = (e: { matches: boolean }) => void;

describe('ThemeService', () => {
  let systemDark = false;
  let changeListener: ChangeListener | undefined;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    systemDark = false;
    changeListener = undefined;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: systemDark,
        addEventListener: (_: string, cb: ChangeListener) => (changeListener = cb),
      })),
    });
  });

  describe('in the browser', () => {
    let spectator: SpectatorService<ThemeService>;
    const createService = createServiceFactory({
      service: ThemeService,
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    it('follows the system by default', () => {
      systemDark = true;
      spectator = createService();
      expect(spectator.service.preference()).toBe('system');
      expect(spectator.service.effective()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('reacts to system changes while on "system"', () => {
      spectator = createService();
      expect(spectator.service.effective()).toBe('light');
      changeListener?.({ matches: true });
      expect(spectator.service.effective()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('reads a saved preference', () => {
      localStorage.setItem('bf-theme', 'dark');
      spectator = createService();
      expect(spectator.service.preference()).toBe('dark');
      expect(spectator.service.effective()).toBe('dark');
    });

    it('toggle saves the opposite theme', () => {
      spectator = createService();
      spectator.service.toggle();
      expect(spectator.service.effective()).toBe('dark');
      expect(localStorage.getItem('bf-theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('set("system") clears the saved preference', () => {
      localStorage.setItem('bf-theme', 'light');
      spectator = createService();
      spectator.service.set('system');
      expect(localStorage.getItem('bf-theme')).toBeNull();
    });
  });

  describe('on the server', () => {
    const createService = createServiceFactory({
      service: ThemeService,
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    it('does not touch the DOM nor storage', () => {
      localStorage.setItem('bf-theme', 'dark');
      const spectator = createService();
      expect(spectator.service.preference()).toBe('system');
      expect(spectator.service.effective()).toBe('light');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
      expect(window.matchMedia).not.toHaveBeenCalled();
    });
  });
});
