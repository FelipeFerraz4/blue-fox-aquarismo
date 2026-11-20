import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { SeoService } from '../../../../core/services/seo/seo-service';

@Component({
  selector: 'app-about',
  imports: [LocalizePipe, RouterLink, TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: this.translate.instant('META.ABOUT_TITLE'),
      description: this.translate.instant('META.ABOUT_DESCRIPTION'),
      image: 'https://bluefoxaquarismo.space/assets/images/brand/logo.webp',
      url: 'https://bluefoxaquarismo.space/about',
    });
  }
}
