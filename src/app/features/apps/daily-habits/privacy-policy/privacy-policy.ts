import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy implements OnInit {
  currentYear = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: "Política de Privacidade - Daily Habits - Blue Fox Aquarismo",
      description: "Política de Privacidade do aplicativo Daily Habits pela Blue Fox Aquarismo.",
      url: "https://bluefoxaquarismo.com.br/apps/daily-habits/privacy-policy",
    });
  }
}
