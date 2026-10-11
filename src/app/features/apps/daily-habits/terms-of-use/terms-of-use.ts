import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-of-use.html',
  styleUrl: './terms-of-use.scss',
})
export class TermsOfUse implements OnInit {
  currentYear = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: "Termos de Uso - Daily Habits - Blue Fox Aquarismo",
      description: "Termos de Uso do aplicativo Daily Habits pela Blue Fox Aquarismo.",
      url: "https://bluefoxaquarismo.com.br/apps/daily-habits/terms-of-use",
    });
  }
}
