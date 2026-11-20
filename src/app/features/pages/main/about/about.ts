import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-about',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    // SEO no idioma indexado (pt-BR): o pré-render sai em português.
    this.seo.updateMetadata({
      title: 'Sobre Blue Fox Aquarismo',
      description:
        'A Blue Fox Aquarismo é uma plataforma educacional criada para compartilhar conhecimento real e acessível sobre aquários, peixes e plantas aquáticas.',
      image: 'https://bluefoxaquarismo.space/assets/images/brand/logo.webp',
      url: 'https://bluefoxaquarismo.space/about',
    });
  }
}
