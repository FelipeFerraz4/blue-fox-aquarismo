import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { ContentLanguageNotice } from '../../../../shared/components/general/content-language-notice/content-language-notice';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [LocalizePipe, ContentLanguageNotice, RouterLink],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy implements OnInit {
  private readonly translate = inject(TranslateService);
  currentYear = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.setupSeo();
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: this.translate.instant('META.DH_PRIVACY_TITLE'),
      description: this.translate.instant('META.DH_PRIVACY_DESCRIPTION'),
      url: "https://bluefoxaquarismo.space/app/daily-habits/privacy-policy",
    });
  }
}
