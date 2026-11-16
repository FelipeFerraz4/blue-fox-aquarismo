import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { EffectiveTheme, ThemePreference } from '../../../shared/model/types/theme';

const STORAGE_KEY = 'bf-theme';

/**
 * Tema claro/escuro. A preferência ("system" por padrão) fica no localStorage e o tema
 * resolvido vai para <html data-theme="light|dark">, que redefine os tokens do styles.scss.
 * O script inline do index.html aplica o mesmo antes do Angular, para não piscar.
 *
 * SSR: no servidor não há localStorage nem matchMedia; o serviço fica em "system"/"light"
 * e não mexe no DOM. O script do index.html resolve o tema no cliente antes da pintura.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly media = this.isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly systemDark = signal(this.media?.matches ?? false);

  readonly preference = signal<ThemePreference>(this.read());
  readonly effective = computed<EffectiveTheme>(() => {
    const pref = this.preference();
    if (pref === 'system') return this.systemDark() ? 'dark' : 'light';
    return pref;
  });

  constructor() {
    if (!this.isBrowser) return;
    this.media?.addEventListener('change', (e) => {
      this.systemDark.set(e.matches);
      this.apply();
    });
    this.apply();
  }

  set(pref: ThemePreference): void {
    this.preference.set(pref);
    if (this.isBrowser) {
      try {
        if (pref === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, pref);
      } catch {
        /* navegação privada: vale só nesta aba */
      }
    }
    this.apply();
  }

  /** Alterna entre claro e escuro (sai de "system" ao escolher manualmente). */
  toggle(): void {
    this.set(this.effective() === 'dark' ? 'light' : 'dark');
  }

  private apply(): void {
    if (!this.isBrowser) return;
    this.document.documentElement.setAttribute('data-theme', this.effective());
  }

  private read(): ThemePreference {
    if (!this.isBrowser) return 'system';
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch {
      return 'system';
    }
  }
}
