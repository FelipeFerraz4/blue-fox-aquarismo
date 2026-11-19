import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  Biome,
  CompatibilityReport,
  Equipment,
  EquipmentType,
  Family,
  Species,
  SpeciesFilters,
} from '../../../shared/model/types/aquarismo';

/**
 * Cliente do catálogo do Aquarismo (espécies, famílias, biomas, equipamentos e compatibilidade).
 * O `X-Blog-ID` vem do tenantInterceptor. `lang` é opcional: sem ele a API responde em pt-BR
 * (ou pelo Accept-Language do navegador). A regra de compatibilidade fica só no backend.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.blogApi.urlBase}${environment.blogApi.request.aquarismo}`;

  listSpecies(filters: SpeciesFilters = {}, lang?: string): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.baseUrl}/species`, { params: this.params({ ...filters, lang }) });
  }

  getSpecies(slug: string, lang?: string): Observable<Species> {
    return this.http.get<Species>(`${this.baseUrl}/species/slug/${encodeURIComponent(slug)}`, { params: this.params({ lang }) });
  }

  listFamilies(lang?: string): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.baseUrl}/families`, { params: this.params({ lang }) });
  }

  listBiomes(lang?: string): Observable<Biome[]> {
    return this.http.get<Biome[]>(`${this.baseUrl}/biomes`, { params: this.params({ lang }) });
  }

  getBiome(slug: string, lang?: string): Observable<Biome> {
    return this.http.get<Biome>(`${this.baseUrl}/biomes/slug/${encodeURIComponent(slug)}`, { params: this.params({ lang }) });
  }

  /** Com `volume`, filtra pela faixa atendida e traz o tamanho recomendado (W, L/h). */
  listEquipment(options: { type?: EquipmentType; volume?: number } = {}, lang?: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.baseUrl}/equipment`, { params: this.params({ ...options, lang }) });
  }

  /**
   * Compatibilidade entre as espécies (slugs). Repita um slug para indicar mais de um indivíduo
   * da mesma espécie (ex.: dois machos de Betta).
   */
  checkCompatibility(slugs: string[], lang?: string): Observable<CompatibilityReport> {
    return this.http.get<CompatibilityReport>(`${this.baseUrl}/compatibility`, {
      params: this.params({ species: slugs.join(','), lang }),
    });
  }

  /** Monta a query ignorando valores vazios (undefined, null, ''). */
  private params(values: Record<string, string | number | boolean | undefined | null>): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value));
    }
    return params;
  }
}
