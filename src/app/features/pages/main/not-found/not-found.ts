import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [LocalizePipe, TranslatePipe, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    // O SSR já responde 404 (app.routes.server.ts); o noindex cobre navegações no cliente.
    this.title.setTitle(this.translate.instant('NOT_FOUND.META_TITLE'));
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
  }

  ngOnDestroy(): void {
    this.meta.removeTag('name="robots"');
  }
}
