import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../../../core/i18n/language-service';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../../core/i18n/locales';

/**
 * Seletor de idioma (navbar): um botão por idioma ativo, com `aria-pressed` e o nome do idioma
 * no próprio idioma (`lang` no rótulo, para o leitor de tela pronunciar certo).
 */
@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);
  protected readonly locales = SUPPORTED_LOCALES;

  select(code: SupportedLocale): void {
    if (code !== this.language.current()) this.language.set(code);
  }
}
