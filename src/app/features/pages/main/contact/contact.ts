import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../core/services/seo/seo-service';
import { ReportError } from '../../../../shared/components/general/report-error/report-error';

/** Contato e correções: formulário de relato (privado) e o e-mail como alternativa. */
@Component({
  selector: 'app-contact',
  imports: [LocalizePipe, TranslatePipe, ReportError, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: this.translate.instant('META.CONTACT_TITLE'),
      description: this.translate.instant('META.CONTACT_DESCRIPTION'),
      url: 'https://bluefoxaquarismo.space/contact',
      type: 'website',
    });
  }
}
