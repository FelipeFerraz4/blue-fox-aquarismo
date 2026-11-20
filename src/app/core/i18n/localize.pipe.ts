import { Pipe, PipeTransform, inject } from '@angular/core';

import { LanguageService } from './language-service';

/**
 * Link interno no idioma atual: `[routerLink]="'/about' | localize"` → "/about" ou "/en/about".
 * Impuro de propósito: acompanha a troca de idioma (lê o signal do LanguageService).
 */
@Pipe({ name: 'localize', pure: false })
export class LocalizePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(path: string): string {
    return this.language.localize(path);
  }
}
