import { PLATFORM_ID } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { A11yToolbar } from './a11y-toolbar';

describe('A11yToolbar', () => {
  describe('in the browser', () => {
    let spectator: Spectator<A11yToolbar>;
    const createComponent = createComponentFactory({
      component: A11yToolbar,
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    beforeEach(() => {
      localStorage.clear();
      document.documentElement.removeAttribute('data-contrast');
      spectator = createComponent();
    });

    it('opens the bar from the floating button', () => {
      const fab = spectator.query<HTMLButtonElement>('.a11y-fab')!;
      expect(fab.getAttribute('aria-expanded')).toBe('false');
      spectator.click(fab);
      expect(spectator.query('[role="toolbar"]')).toBeTruthy();
      expect(fab.getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles high contrast with aria-pressed', () => {
      spectator.click('.a11y-fab');
      const btn = spectator.query<HTMLButtonElement>('[aria-label="Alto contraste"]')!;
      spectator.click(btn);
      expect(btn.getAttribute('aria-pressed')).toBe('true');
      expect(document.documentElement.getAttribute('data-contrast')).toBe('high');
    });

    it('closes on Escape and returns focus to the floating button', () => {
      spectator.click('.a11y-fab');
      spectator.dispatchKeyboardEvent(document, 'keydown', 'Escape');
      spectator.detectChanges();
      expect(spectator.query('[role="toolbar"]')).toBeNull();
      expect(document.activeElement).toBe(spectator.query('.a11y-fab'));
    });

    it('closes when clicking outside', () => {
      spectator.click('.a11y-fab');
      document.body.click();
      spectator.detectChanges();
      expect(spectator.query('[role="toolbar"]')).toBeNull();
    });
  });

  describe('on the server', () => {
    const createComponent = createComponentFactory({
      component: A11yToolbar,
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    it('renders nothing', () => {
      const spectator = createComponent();
      expect(spectator.query('.a11y-fab')).toBeNull();
    });
  });
});
