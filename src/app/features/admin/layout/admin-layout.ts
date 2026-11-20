import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../core/i18n/localize.pipe';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth-service';
import { TranslateService } from '@ngx-translate/core';

/** Moldura do painel: navegação lateral, título e noindex (o painel nunca deve ser indexado). */
@Component({
  selector: 'app-admin-layout',
  imports: [TranslatePipe, LocalizePipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss', '../admin-shared.scss'],
})
export class AdminLayout implements OnInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);

  readonly links = [
    { path: '/admin', label: 'ADMIN.NAV_DASHBOARD', exact: true },
    { path: '/admin/reports', label: 'ADMIN.NAV_REPORTS', exact: false },
    { path: '/admin/catalog', label: 'ADMIN.NAV_CATALOG', exact: false },
    { path: '/admin/posts', label: 'ADMIN.NAV_POSTS', exact: false },
  ];

  ngOnInit(): void {
    this.title.setTitle(this.translate.instant('ADMIN.META_TITLE'));
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  ngOnDestroy(): void {
    this.meta.removeTag('name="robots"');
  }
}
