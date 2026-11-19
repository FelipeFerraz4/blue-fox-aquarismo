import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';

const SCALE_KEY = 'bf-font-scale';
const CONTRAST_KEY = 'bf-contrast';

export const FONT_SCALE_MIN = 0.875;
export const FONT_SCALE_MAX = 1.5;
const FONT_SCALE_STEP = 0.125;

/** Onde a leitura em voz alta começa quando não há texto selecionado (o primeiro que existir). */
const READ_TARGETS = ['article.content', 'main'];

/**
 * Recursos da barra de acessibilidade:
 * - tamanho da fonte (A-/A+) via --a11y-font-scale no <html> (o layout é todo em rem);
 * - alto contraste via <html data-contrast="high">;
 * - leitura em voz alta (Web Speech API) do texto selecionado ou, sem seleção, do corpo do artigo
 *   (ou do <main> nas outras páginas).
 * As preferências ficam no localStorage e o script do index.html as aplica antes do Angular.
 * SSR: no servidor nada é lido nem aplicado (valores padrão).
 */
@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly fontScale = signal<number>(this.readScale());
  readonly highContrast = signal<boolean>(this.readContrast());
  readonly speaking = signal(false);
  readonly speechSupported =
    this.isBrowser && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  readonly canDecrease = computed(() => this.fontScale() > FONT_SCALE_MIN);
  readonly canIncrease = computed(() => this.fontScale() < FONT_SCALE_MAX);
  readonly isDefault = computed(() => this.fontScale() === 1 && !this.highContrast());

  constructor() {
    this.applyScale();
    this.applyContrast();
  }

  increaseFont(): void {
    this.setScale(this.fontScale() + FONT_SCALE_STEP);
  }

  decreaseFont(): void {
    this.setScale(this.fontScale() - FONT_SCALE_STEP);
  }

  toggleContrast(): void {
    this.highContrast.set(!this.highContrast());
    this.store(CONTRAST_KEY, this.highContrast() ? 'high' : null);
    this.applyContrast();
  }

  /** Volta fonte e contraste ao padrão e para a leitura. O tema não muda. */
  reset(): void {
    this.setScale(1);
    if (this.highContrast()) this.toggleContrast();
    this.stopSpeaking();
  }

  /** Lê o texto selecionado; sem seleção, lê o corpo do artigo (ou o conteúdo principal). */
  toggleSpeech(): void {
    if (!this.speechSupported) return;
    if (this.speaking()) {
      this.stopSpeaking();
      return;
    }
    const text = this.textToRead();
    if (!text) return;

    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 8000));
    utterance.lang = 'pt-BR';
    const voice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pt'));
    if (voice) utterance.voice = voice;
    const done = () => this.zone.run(() => this.speaking.set(false));
    utterance.onend = done;
    utterance.onerror = done;
    this.speaking.set(true);
    synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.speechSupported) window.speechSynthesis.cancel();
    this.speaking.set(false);
  }

  private textToRead(): string {
    const selected = window.getSelection()?.toString().trim();
    if (selected) return selected.replace(/\s+/g, ' ');
    const target =
      READ_TARGETS.map((s) => this.document.querySelector<HTMLElement>(s)).find(Boolean) ??
      this.document.body;
    return (target.innerText || target.textContent || '').replace(/\s+/g, ' ').trim();
  }

  private setScale(value: number): void {
    const stepped = Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP;
    const v = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, stepped));
    this.fontScale.set(v);
    this.store(SCALE_KEY, v === 1 ? null : String(v));
    this.applyScale();
  }

  private applyScale(): void {
    if (!this.isBrowser) return;
    this.document.documentElement.style.setProperty('--a11y-font-scale', String(this.fontScale()));
  }

  private applyContrast(): void {
    if (!this.isBrowser) return;
    const html = this.document.documentElement;
    if (this.highContrast()) html.setAttribute('data-contrast', 'high');
    else html.removeAttribute('data-contrast');
  }

  private readScale(): number {
    if (!this.isBrowser) return 1;
    try {
      const v = parseFloat(localStorage.getItem(SCALE_KEY) ?? '');
      return v >= FONT_SCALE_MIN && v <= FONT_SCALE_MAX ? v : 1;
    } catch {
      return 1;
    }
  }

  private readContrast(): boolean {
    if (!this.isBrowser) return false;
    try {
      return localStorage.getItem(CONTRAST_KEY) === 'high';
    } catch {
      return false;
    }
  }

  private store(key: string, value: string | null): void {
    if (!this.isBrowser) return;
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* navegação privada: vale só nesta aba */
    }
  }
}
