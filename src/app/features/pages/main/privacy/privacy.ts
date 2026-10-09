import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy implements OnInit {
  currentYear = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: "Política de Privacidade - Blue Fox Aquarismo",
      description: "Confira a política de privacidade da Blue Fox Aquarismo e entenda como tratamos e protegemos seus dados.",
      url: "https://bluefoxaquarismo.com.br/privacy",
    });
  }
}