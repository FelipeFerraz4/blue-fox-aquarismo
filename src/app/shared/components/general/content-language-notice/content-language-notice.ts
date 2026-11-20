import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../../../core/i18n/language-service';

/**
 * Aviso exibido em conteúdo editorial que só existe em pt-BR (textos legais, artigos) quando a
 * interface está em outro idioma. O próprio aviso fica no idioma da interface (`lang` dele).
 */
@Component({
  selector: 'app-content-language-notice',
  imports: [TranslatePipe],
  templateUrl: './content-language-notice.html',
  styleUrl: './content-language-notice.scss',
})
export class ContentLanguageNotice {
  protected readonly language = inject(LanguageService);
}
