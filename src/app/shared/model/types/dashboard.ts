import { Publication } from './aquarismo';
import { ReportStatus, ReportTargetType } from './report';

/** Resposta de `GET /api/v1/dashboard/stats` (painel admin). */
export interface DashboardStats {
  generatedAt: string;
  posts: {
    total: number;
    published: number;
    drafts: number;
    byCategory: { categoryId: string; category: string; slug: string; published: number; drafts: number }[];
    mostRead: { id: string; title: string; slug: string; views: number }[];
  };
  species: {
    byPublication: Record<Publication, number>;
    byFamily: { slug: string; name: string; count: number }[];
    byBiome: { slug: string; name: string; count: number }[];
    staleReviewMonths: number;
    needsReview: { id: string; slug: string; name: string; lastReviewedAt: string | null }[];
  };
  reports: {
    byStatus: Record<ReportStatus, number>;
    pending: number;
    latest: {
      id: string;
      targetType: ReportTargetType;
      targetSlug: string;
      targetTitle: string | null;
      message: string;
      status: ReportStatus;
      createdAt: string;
    }[];
  };
}
