import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { DashboardStats } from '../../../shared/model/types/dashboard';
import { REPORT_STATUS_LABEL, REPORT_TARGET_LABEL } from '../../../shared/model/types/report';

/**
 * Visão geral: artigos por categoria, mais lidos, espécies por situação/família/bioma, fichas sem
 * revisão e relatos. Os números ficam em tabelas; as barras são só um reforço visual (aria-hidden).
 */
@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss', '../admin-shared.scss'],
})
export class AdminDashboard implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly error = signal(false);
  readonly statusLabel = REPORT_STATUS_LABEL;
  readonly targetLabel = REPORT_TARGET_LABEL;
  readonly publicationLabel: Record<string, string> = { DRAFT: 'Rascunho', REVIEWED: 'Revisado', PUBLISHED: 'Publicado' };

  ngOnInit(): void {
    this.api.stats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => this.error.set(true),
    });
  }

  /** Largura relativa da barra (0–100%) em relação ao maior valor da lista. */
  bar(value: number, values: number[]): number {
    const max = Math.max(1, ...values);
    return Math.round((value / max) * 100);
  }

  entries<T extends string>(record: Record<T, number>): [T, number][] {
    return Object.entries(record) as [T, number][];
  }

  totals(rows: { published: number; drafts: number }[]): number[] {
    return rows.map((r) => r.published + r.drafts);
  }

  counts(rows: { count: number }[]): number[] {
    return rows.map((r) => r.count);
  }
}
