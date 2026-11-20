import { DatePipe } from '@angular/common';
import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { Biome, Equipment, Publication, Species } from '../../../shared/model/types/aquarismo';

export const PUBLICATION_LABEL: Record<Publication, string> = {
  DRAFT: 'Rascunho',
  REVIEWED: 'Revisado',
  PUBLISHED: 'Publicado',
};

/**
 * Catálogo no painel: espécies (abre a ficha para editar), biomas e equipamentos (troca a publicação
 * direto na lista; a edição detalhada deles fica para quando o conteúdo das fases 6 e 8 chegar).
 */
@Component({
  selector: 'app-admin-catalog',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-catalog.html',
  styleUrls: ['./admin-catalog.scss', '../admin-shared.scss'],
})
export class AdminCatalog implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly publications = Object.keys(PUBLICATION_LABEL) as Publication[];
  readonly publicationLabel = PUBLICATION_LABEL;
  readonly species = signal<Species[] | null>(null);
  readonly biomes = signal<Biome[] | null>(null);
  readonly equipment = signal<Equipment[] | null>(null);
  readonly status = signal<{ text: string; ok: boolean } | null>(null);

  ngOnInit(): void {
    this.api.listSpecies().subscribe({ next: (l) => this.species.set(l), error: () => this.fail('espécies') });
    this.api.listBiomes().subscribe({ next: (l) => this.biomes.set(l), error: () => this.fail('biomas') });
    this.api.listEquipment().subscribe({ next: (l) => this.equipment.set(l), error: () => this.fail('equipamentos') });
  }

  badgeClass(p: Publication): string {
    return p === 'PUBLISHED' ? 'badge-ok' : p === 'REVIEWED' ? 'badge-warn' : '';
  }

  setBiome(b: Biome, event: Event): void {
    this.apply(this.api.setBiomePublication(b.id, this.selected(event)), b.name, this.biomes);
  }

  setEquipment(e: Equipment, event: Event): void {
    this.apply(this.api.setEquipmentPublication(e.id, this.selected(event)), e.name, this.equipment);
  }

  private selected(event: Event): Publication {
    return (event.target as HTMLSelectElement).value as Publication;
  }

  private apply<T extends { id: string; publication: Publication }>(
    request: Observable<T>,
    name: string,
    list: WritableSignal<T[] | null>,
  ): void {
    request.subscribe({
      next: (updated) => {
        list.update((items) => items?.map((i) => (i.id === updated.id ? updated : i)) ?? null);
        this.status.set({ text: `${name}: ${this.publicationLabel[updated.publication]}.`, ok: true });
      },
      error: () => this.status.set({ text: `Não foi possível atualizar ${name}.`, ok: false }),
    });
  }

  private fail(what: string): void {
    this.status.set({ text: `Não foi possível carregar ${what}.`, ok: false });
  }
}
