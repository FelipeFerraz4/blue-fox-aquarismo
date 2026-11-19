import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';

import { AccessibilityService } from '../../../../core/services/accessibility/accessibility-service';
import { ThemeService } from '../../../../core/services/theme/theme-service';

/**
 * Barra de acessibilidade flutuante (todas as páginas): A-, A+, restaurar, alto contraste,
 * leitura em voz alta e tema claro/escuro. Fecha com Esc (devolvendo o foco) ou clicando fora.
 * Só é renderizada no navegador: depende de localStorage e da Web Speech API.
 */
@Component({
  selector: 'app-a11y-toolbar',
  templateUrl: './a11y-toolbar.html',
  styleUrl: './a11y-toolbar.scss',
})
export class A11yToolbar {
  readonly a11y = inject(AccessibilityService);
  readonly theme = inject(ThemeService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly open = signal(false);

  toggle(): void {
    this.open.set(!this.open());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.host.nativeElement.querySelector<HTMLButtonElement>('.a11y-fab')?.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
}
