import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../core/services/seo/seo-service';
import { ReportError } from '../../../../shared/components/general/report-error/report-error';

/** Contato e correções: formulário de relato (privado) e o e-mail como alternativa. */
@Component({
  selector: 'app-contact',
  imports: [TranslatePipe, ReportError, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: 'Contato e correções | Blue Fox Aquarismo',
      description: 'Encontrou uma informação errada? Envie uma correção pelo formulário ou por e-mail para a Blue Fox Aquarismo.',
      url: 'https://bluefoxaquarismo.space/contact',
      type: 'website',
    });
  }
}
