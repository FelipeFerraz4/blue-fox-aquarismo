import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CONTENT_ADMIN_ROLES } from '../../../core/auth/roles.constants';
import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { AuthService } from '../../../core/services/auth/auth-service';
import { REPORT_STATUS_LABEL, REPORT_TARGET_LABEL, Report, ReportStatus } from '../../../shared/model/types/report';

interface Draft {
  status: ReportStatus;
  internalNote: string;
}

/**
 * Fila de relatos: filtra por situação, abre o alvo para corrigir, muda a situação e guarda uma nota
 * interna. Excluir de vez (pedido de apagar e-mail, LGPD) só para admin.
 */
@Component({
  selector: 'app-admin-reports',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.scss', '../admin-shared.scss'],
})
export class AdminReports implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly auth = inject(AuthService);

  readonly statuses = Object.keys(REPORT_STATUS_LABEL) as ReportStatus[];
  readonly statusLabel = REPORT_STATUS_LABEL;
  readonly targetLabel = REPORT_TARGET_LABEL;
  readonly canDelete = this.auth.hasAnyRole(CONTENT_ADMIN_ROLES);

  readonly filter = signal<ReportStatus | ''>('NEW');
  readonly reports = signal<Report[] | null>(null);
  readonly drafts = signal<Record<string, Draft>>({});
  readonly message = signal<{ id: string; text: string; ok: boolean } | null>(null);
  readonly loadError = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.reports.set(null);
    this.loadError.set(false);
    const status = this.filter() || undefined;
    this.api.listReports({ status }).subscribe({
      next: (list) => {
        this.reports.set(list);
        this.drafts.set(Object.fromEntries(list.map((r) => [r.id, { status: r.status, internalNote: r.internalNote ?? '' }])));
      },
      error: () => this.loadError.set(true),
    });
  }

  setFilter(value: string): void {
    this.filter.set(value as ReportStatus | '');
    this.load();
  }

  draft(id: string): Draft {
    return this.drafts()[id];
  }

  updateDraft(id: string, changes: Partial<Draft>): void {
    this.drafts.update((d) => ({ ...d, [id]: { ...d[id], ...changes } }));
  }

  save(report: Report): void {
    const d = this.draft(report.id);
    this.api.updateReport(report.id, { status: d.status, internalNote: d.internalNote }).subscribe({
      next: (updated) => {
        this.reports.update((list) => list?.map((r) => (r.id === updated.id ? updated : r)) ?? null);
        this.message.set({ id: report.id, text: `Salvo: ${this.statusLabel[updated.status]}.`, ok: true });
      },
      error: () => this.message.set({ id: report.id, text: 'Não foi possível salvar.', ok: false }),
    });
  }

  remove(report: Report): void {
    if (!confirm('Excluir este relato de vez? Isso também apaga o e-mail do leitor.')) return;
    this.api.deleteReport(report.id).subscribe({
      next: () => this.reports.update((list) => list?.filter((r) => r.id !== report.id) ?? null),
      error: () => this.message.set({ id: report.id, text: 'Não foi possível excluir.', ok: false }),
    });
  }

  /** Onde corrigir: ficha no painel (espécie) ou a página pública (artigo e demais). */
  targetLink(r: Report): string[] | null {
    if (r.targetType === 'SPECIES') return ['/admin/catalog/species', r.targetSlug];
    if (r.targetType === 'POST') return ['/articles', r.targetSlug];
    return null;
  }
}
