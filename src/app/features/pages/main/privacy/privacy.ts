import { LanguageService } from '../../../../core/i18n/language-service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LocalizePipe, RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy implements OnInit {
  protected readonly language = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  currentYear = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: this.translate.instant('META.PRIVACY_TITLE'),
      description: this.translate.instant('META.PRIVACY_DESCRIPTION'),
      url: "https://bluefoxaquarismo.space/privacy-policy",
    });
  }
}