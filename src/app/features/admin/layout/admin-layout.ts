import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth-service';

/** Moldura do painel: navegação lateral, título e noindex (o painel nunca deve ser indexado). */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss', '../admin-shared.scss'],
})
export class AdminLayout implements OnInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly links = [
    { path: '/admin', label: 'Painel', exact: true },
    { path: '/admin/reports', label: 'Relatos', exact: false },
    { path: '/admin/catalog', label: 'Catálogo', exact: false },
    { path: '/admin/posts', label: 'Posts', exact: false },
  ];

  ngOnInit(): void {
    this.title.setTitle('Painel | Blue Fox Aquarismo');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  ngOnDestroy(): void {
    this.meta.removeTag('name="robots"');
  }
}
