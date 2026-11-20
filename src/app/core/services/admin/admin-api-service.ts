import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { withAuth } from '../../interceptors/auth.interceptor';
import { Biome, Equipment, Publication, Species } from '../../../shared/model/types/aquarismo';
import { DashboardStats } from '../../../shared/model/types/dashboard';
import { Post } from '../../../shared/model/types/post';
import { Report, ReportStatus, ReportTargetType } from '../../../shared/model/types/report';

/** Tradução enviada ao salvar uma espécie (o backend faz upsert por idioma). */
export interface SpeciesTranslationInput {
  locale: string;
  commonName: string;
  otherNames?: string[];
  region?: string;
  description: string;
  careNotes?: string;
}

export type SpeciesUpdate = Partial<
  Omit<Species, 'id' | 'slug' | 'locale' | 'family' | 'biomes' | 'createdAt' | 'updatedAt' | 'status' | 'commonName' | 'otherNames' | 'region' | 'description' | 'careNotes'>
> & { translations?: SpeciesTranslationInput[] };

/**
 * API do painel /admin. Toda chamada leva o token (withAuth) e, por isso, enxerga rascunhos
 * e itens revisados. Leituras sempre em pt-BR, o idioma de edição.
 */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private api = `${environment.blogApi.urlBase}api/v1`;
  private aq = `${this.api}/aquarismo`;
  private ctx = { context: withAuth() };

  stats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.api}/dashboard/stats`, this.ctx);
  }

  // Relatos
  listReports(filters: { status?: ReportStatus; targetType?: ReportTargetType } = {}): Observable<Report[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.targetType) params = params.set('targetType', filters.targetType);
    return this.http.get<Report[]>(`${this.api}/reports`, { ...this.ctx, params });
  }

  updateReport(id: string, changes: { status?: ReportStatus; internalNote?: string }): Observable<Report> {
    return this.http.patch<Report>(`${this.api}/reports/${id}`, changes, this.ctx);
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/reports/${id}`, this.ctx);
  }

  // Catálogo
  listSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.aq}/species`, { ...this.ctx, params: { lang: 'pt-BR' } });
  }

  getSpecies(slug: string, lang = 'pt-BR'): Observable<Species> {
    return this.http.get<Species>(`${this.aq}/species/slug/${encodeURIComponent(slug)}`, { ...this.ctx, params: { lang } });
  }

  updateSpecies(id: string, changes: SpeciesUpdate): Observable<Species> {
    return this.http.put<Species>(`${this.aq}/species/${id}`, changes, this.ctx);
  }

  listBiomes(): Observable<Biome[]> {
    return this.http.get<Biome[]>(`${this.aq}/biomes`, { ...this.ctx, params: { lang: 'pt-BR' } });
  }

  setBiomePublication(id: string, publication: Publication): Observable<Biome> {
    return this.http.put<Biome>(`${this.aq}/biomes/${id}`, { publication }, this.ctx);
  }

  listEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.aq}/equipment`, { ...this.ctx, params: { lang: 'pt-BR' } });
  }

  setEquipmentPublication(id: string, publication: Publication): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.aq}/equipment/${id}`, { publication }, this.ctx);
  }

  // Posts
  listPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.api}/posts/all`, this.ctx);
  }

  setPostPublished(id: string, published: boolean): Observable<Post> {
    return this.http.put<Post>(`${this.api}/posts/${id}`, { published }, this.ctx);
  }
}
