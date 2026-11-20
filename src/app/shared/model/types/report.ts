/** Relatos de erro dos leitores (blog-api `/api/v1/reports`). */

export type ReportTargetType = 'POST' | 'SPECIES' | 'BIOME' | 'EQUIPMENT' | 'PAGE';
export type ReportStatus = 'NEW' | 'IN_REVIEW' | 'FIXED' | 'DISMISSED';

/** O que o leitor envia. `website` é o campo-isca (fica escondido e vazio). */
export interface ReportInput {
  targetType: ReportTargetType;
  targetSlug: string;
  targetTitle?: string;
  pageUrl?: string;
  message: string;
  suggestion?: string;
  source?: string;
  email?: string;
  website?: string;
}

export interface Report extends ReportInput {
  id: string;
  status: ReportStatus;
  internalNote: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  NEW: 'Novo',
  IN_REVIEW: 'Em análise',
  FIXED: 'Corrigido',
  DISMISSED: 'Descartado',
};

export const REPORT_TARGET_LABEL: Record<ReportTargetType, string> = {
  POST: 'Artigo',
  SPECIES: 'Espécie',
  BIOME: 'Bioma',
  EQUIPMENT: 'Equipamento',
  PAGE: 'Página',
};
