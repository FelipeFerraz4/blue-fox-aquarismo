import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-article-page',
  standalone: true,
  imports: [],
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: "Artigos - Blue Fox Aquarismo",
      description: "Confira todos os artigos, guias e dicas práticas sobre aquarismo da Blue Fox Aquarismo.",
      url: "https://bluefoxaquarismo.com.br/articles",
    });
  }
}
