import { formatDate, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Pipe, PipeTransform, inject } from '@angular/core';

import { LanguageService } from './language-service';

// Dados de formatação de cada idioma ativo (o inglês já vem embutido no Angular).
registerLocaleData(localePt, 'pt-BR');

/**
 * Data no idioma da interface: `{{ post.publishedAt | localDate }}` → "19 de outubro de 2026" / "October 19, 2026".
 * Impuro de propósito: reavalia quando o idioma muda (lê o signal do LanguageService).
 * O fuso padrão é UTC, como as datas de publicação vindas da API.
 */
@Pipe({ name: 'localDate', pure: false })
export class LocalDatePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(value: string | number | Date | null | undefined, format = 'longDate', timezone = 'UTC'): string {
    if (value === null || value === undefined || value === '') return '';
    try {
      return formatDate(value, format, this.language.dateLocale(), timezone);
    } catch {
      return '';
    }
  }
}
