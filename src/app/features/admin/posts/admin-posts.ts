import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { Post } from '../../../shared/model/types/post';

/**
 * Posts: publicar e despublicar. Lembrete: um artigo só aparece no site se, além de publicado aqui,
 * a rota dele estiver em `publishedRoutes` (articles.routing.ts) — isso exige deploy.
 */
@Component({
  selector: 'app-admin-posts',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-posts.html',
  styleUrls: ['./admin-posts.scss', '../admin-shared.scss'],
})
export class AdminPosts implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly posts = signal<Post[] | null>(null);
  readonly loadError = signal(false);
  readonly status = signal<{ text: string; ok: boolean } | null>(null);
  readonly busy = signal<string | null>(null);

  ngOnInit(): void {
    this.api.listPosts().subscribe({
      next: (list) => this.posts.set([...list].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))),
      error: () => this.loadError.set(true),
    });
  }

  toggle(post: Post): void {
    const published = !post.published;
    if (!published && !confirm(`Despublicar "${post.title}"? Ele deixa de aparecer nas listas do site.`)) return;
    this.busy.set(post.id);
    this.api.setPostPublished(post.id, published).subscribe({
      next: (updated) => {
        this.busy.set(null);
        this.posts.update((list) => list?.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)) ?? null);
        this.status.set({ text: `"${post.title}" ${published ? 'publicado' : 'despublicado'}.`, ok: true });
      },
      error: () => {
        this.busy.set(null);
        this.status.set({ text: `Não foi possível atualizar "${post.title}".`, ok: false });
      },
    });
  }
}
