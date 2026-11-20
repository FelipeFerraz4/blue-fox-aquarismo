import { LocalDatePipe } from '../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../core/i18n/localize.pipe';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { Post } from '../../../shared/model/types/post';

/**
 * Posts: publicar e despublicar. Lembrete: um artigo só aparece no site se, além de publicado aqui,
 * a rota dele estiver em `publishedRoutes` (articles.routing.ts) — isso exige deploy.
 */
@Component({
  selector: 'app-admin-posts',
  imports: [LocalDatePipe, TranslatePipe, LocalizePipe, RouterLink],
  templateUrl: './admin-posts.html',
  styleUrls: ['./admin-posts.scss', '../admin-shared.scss'],
})
export class AdminPosts implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly translate = inject(TranslateService);

  readonly posts = signal<Post[] | null>(null);
  readonly loadError = signal(false);
  readonly status = signal<{ text: string; ok: boolean } | null>(null);
  readonly busy = signal<string | null>(null);

  ngOnInit(): void {
    this.api.listPosts().subscribe({
      next: (list) => this.posts.set([...list].sort((a, b) => a.title.localeCompare(b.title, this.translate.getCurrentLang() ?? 'pt-BR'))),
      error: () => this.loadError.set(true),
    });
  }

  toggle(post: Post): void {
    const published = !post.published;
    if (!published && !confirm(this.translate.instant('ADMIN.POSTS.CONFIRM_UNPUBLISH', { title: post.title }))) return;
    this.busy.set(post.id);
    this.api.setPostPublished(post.id, published).subscribe({
      next: (updated) => {
        this.busy.set(null);
        this.posts.update((list) => list?.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)) ?? null);
        this.status.set({
          text: this.translate.instant(published ? 'ADMIN.POSTS.DONE_PUBLISHED' : 'ADMIN.POSTS.DONE_UNPUBLISHED', { title: post.title }),
          ok: true,
        });
      },
      error: () => {
        this.busy.set(null);
        this.status.set({ text: this.translate.instant('ADMIN.POSTS.UPDATE_ERROR', { title: post.title }), ok: false });
      },
    });
  }
}
