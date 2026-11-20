import { LocalDatePipe } from '../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../core/i18n/localize.pipe';
import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminApiService } from '../../../core/services/admin/admin-api-service';
import { TranslateService } from '@ngx-translate/core';
import { Biome, Equipment, Publication, Species } from '../../../shared/model/types/aquarismo';

/** Situações editoriais, na ordem do fluxo (rótulos em ADMIN.PUBLICATION.*). */
export const PUBLICATIONS: Publication[] = ['DRAFT', 'REVIEWED', 'PUBLISHED'];

/**
 * Catálogo no painel: espécies (abre a ficha para editar), biomas e equipamentos (troca a publicação
 * direto na lista; a edição detalhada deles fica para quando o conteúdo das fases 6 e 8 chegar).
 */
@Component({
  selector: 'app-admin-catalog',
  imports: [LocalDatePipe, TranslatePipe, LocalizePipe, RouterLink],
  templateUrl: './admin-catalog.html',
  styleUrls: ['./admin-catalog.scss', '../admin-shared.scss'],
})
export class AdminCatalog implements OnInit {
  private readonly api = inject(AdminApiService);

  private readonly translate = inject(TranslateService);
  readonly publications = PUBLICATIONS;
  readonly species = signal<Species[] | null>(null);
  readonly biomes = signal<Biome[] | null>(null);
  readonly equipment = signal<Equipment[] | null>(null);
  readonly status = signal<{ text: string; ok: boolean } | null>(null);

  ngOnInit(): void {
    this.api.listSpecies().subscribe({ next: (l) => this.species.set(l), error: () => this.fail('ADMIN.CATALOG.SPECIES') });
    this.api.listBiomes().subscribe({ next: (l) => this.biomes.set(l), error: () => this.fail('ADMIN.CATALOG.BIOMES') });
    this.api.listEquipment().subscribe({ next: (l) => this.equipment.set(l), error: () => this.fail('ADMIN.CATALOG.EQUIPMENT') });
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
        this.status.set({
          text: this.translate.instant('ADMIN.CATALOG.UPDATED', { name, status: this.translate.instant('ADMIN.PUBLICATION.' + updated.publication) }),
          ok: true,
        });
      },
      error: () => this.status.set({ text: this.translate.instant('ADMIN.CATALOG.UPDATE_ERROR', { name }), ok: false }),
    });
  }

  private fail(whatKey: string): void {
    const what = this.translate.instant(whatKey).toLowerCase();
    this.status.set({ text: this.translate.instant('ADMIN.CATALOG.LOAD_ERROR', { what }), ok: false });
  }
}
