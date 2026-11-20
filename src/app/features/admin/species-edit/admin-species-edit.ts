import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AdminApiService, SpeciesTranslationInput } from '../../../core/services/admin/admin-api-service';
import { Difficulty, Diet, Publication, Species, SwimLayer, Temperament } from '../../../shared/model/types/aquarismo';
import { PUBLICATION_LABEL } from '../catalog/admin-catalog';

/**
 * Edição da ficha de uma espécie (dados estruturados + textos em pt-BR e en). Salvar grava direto na
 * API: a correção vale no site na hora, sem deploy. "Marcar como revisada hoje" atualiza a data de
 * revisão usada no painel ("fichas sem revisão").
 */
@Component({
  selector: 'app-admin-species-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-species-edit.html',
  styleUrls: ['./admin-species-edit.scss', '../admin-shared.scss'],
})
export class AdminSpeciesEdit implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly species = signal<Species | null>(null);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly status = signal<{ text: string; ok: boolean } | null>(null);

  readonly publicationLabel = PUBLICATION_LABEL;
  readonly publications = Object.keys(PUBLICATION_LABEL) as Publication[];
  readonly temperaments: { value: Temperament; label: string }[] = [
    { value: 'PEACEFUL', label: 'Pacífico' },
    { value: 'SEMI_AGGRESSIVE', label: 'Semiagressivo' },
    { value: 'AGGRESSIVE', label: 'Agressivo' },
  ];
  readonly difficulties: { value: Difficulty; label: string }[] = [
    { value: 'BEGINNER', label: 'Iniciante' },
    { value: 'INTERMEDIATE', label: 'Intermediário' },
    { value: 'ADVANCED', label: 'Avançado' },
  ];
  readonly diets: { value: Diet; label: string }[] = [
    { value: 'HERBIVORE', label: 'Herbívoro' },
    { value: 'OMNIVORE', label: 'Onívoro' },
    { value: 'CARNIVORE', label: 'Carnívoro' },
  ];
  readonly layers: { value: SwimLayer; label: string }[] = [
    { value: 'SURFACE', label: 'Superfície' },
    { value: 'MIDDLE', label: 'Meio' },
    { value: 'BOTTOM', label: 'Fundo' },
  ];
  readonly flags = [
    { key: 'finNipper', label: 'Belisca nadadeiras' },
    { key: 'longFinned', label: 'Nadadeiras longas' },
    { key: 'territorial', label: 'Territorial' },
    { key: 'conspecificAggression', label: 'Machos brigam entre si' },
    { key: 'needsPlants', label: 'Precisa de plantas' },
    { key: 'needsHiding', label: 'Precisa de esconderijos' },
    { key: 'eatsPlants', label: 'Come plantas' },
    { key: 'jumps', label: 'Salta (aquário com tampa)' },
  ] as const;

  readonly form = this.fb.group({
    publication: ['DRAFT' as Publication],
    markReviewed: [false],
    adultSizeCm: [0, [Validators.required, Validators.min(0.5)]],
    minVolumeL: [0, [Validators.required, Validators.min(1)]],
    minTankLengthCm: [0, [Validators.required, Validators.min(1)]],
    minGroupSize: [1, [Validators.required, Validators.min(1)]],
    tempMinC: [0, [Validators.required, Validators.min(0), Validators.max(40)]],
    tempMaxC: [0, [Validators.required, Validators.min(0), Validators.max(40)]],
    phMin: [0, [Validators.required, Validators.min(0), Validators.max(14)]],
    phMax: [0, [Validators.required, Validators.min(0), Validators.max(14)]],
    ghMin: [null as number | null],
    ghMax: [null as number | null],
    temperament: ['PEACEFUL' as Temperament],
    maleTemperament: ['' as Temperament | ''],
    difficulty: ['BEGINNER' as Difficulty],
    diet: ['OMNIVORE' as Diet],
    layers: [[] as SwimLayer[]],
    finNipper: [false],
    longFinned: [false],
    territorial: [false],
    conspecificAggression: [false],
    needsPlants: [false],
    needsHiding: [false],
    eatsPlants: [false],
    jumps: [false],
    pt: this.fb.group({
      commonName: ['', Validators.required],
      region: [''],
      description: ['', Validators.required],
      careNotes: [''],
    }),
    en: this.fb.group({
      commonName: [''],
      region: [''],
      description: [''],
      careNotes: [''],
    }),
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    forkJoin({ pt: this.api.getSpecies(slug, 'pt-BR'), en: this.api.getSpecies(slug, 'en') }).subscribe({
      next: ({ pt, en }) => {
        this.species.set(pt);
        this.form.patchValue({
          ...pt,
          maleTemperament: pt.maleTemperament ?? '',
          markReviewed: false,
          pt: { commonName: pt.commonName, region: pt.region ?? '', description: pt.description, careNotes: pt.careNotes ?? '' },
          // Sem tradução em inglês a API devolve o pt-BR (fallback): nesse caso o campo fica vazio.
          en:
            en.locale === 'en'
              ? { commonName: en.commonName, region: en.region ?? '', description: en.description, careNotes: en.careNotes ?? '' }
              : {},
        });
      },
      error: () => this.loadError.set(true),
    });
  }

  hasLayer(layer: SwimLayer): boolean {
    return this.form.controls.layers.value.includes(layer);
  }

  toggleLayer(layer: SwimLayer, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.form.controls.layers.value.filter((l) => l !== layer);
    this.form.controls.layers.setValue(checked ? [...current, layer] : current);
  }

  save(): void {
    const sp = this.species();
    if (!sp) return;
    const v = this.form.getRawValue();
    if (this.form.invalid || !v.layers.length) {
      this.form.markAllAsTouched();
      this.status.set({ text: 'Confira os campos obrigatórios (nome, descrição, camadas e números).', ok: false });
      return;
    }
    if (v.tempMinC > v.tempMaxC || v.phMin > v.phMax || (v.ghMin != null && v.ghMax != null && v.ghMin > v.ghMax)) {
      this.status.set({ text: 'O mínimo não pode ser maior que o máximo (temperatura, pH ou GH).', ok: false });
      return;
    }

    const { pt, en, markReviewed, maleTemperament, ...fields } = v;
    const translations: SpeciesTranslationInput[] = [{ locale: 'pt-BR', ...this.text(pt) }];
    if (en.commonName.trim() && en.description.trim()) translations.push({ locale: 'en', ...this.text(en) });
    this.saving.set(true);
    this.api
      .updateSpecies(sp.id, {
        ...fields,
        // Vazio = limpar (null), para a correção remover um valor antigo.
        ghMin: v.ghMin ?? null,
        ghMax: v.ghMax ?? null,
        maleTemperament: maleTemperament || null,
        ...(markReviewed && { lastReviewedAt: new Date().toISOString() }),
        translations,
      })
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.species.set(updated);
          this.form.controls.markReviewed.setValue(false);
          this.status.set({ text: `Ficha salva (${this.publicationLabel[updated.publication]}).`, ok: true });
        },
        error: () => {
          this.saving.set(false);
          this.status.set({ text: 'Não foi possível salvar. Confira os dados e tente de novo.', ok: false });
        },
      });
  }

  /** Remove textos opcionais vazios (a API trata ausente como "sem valor"). */
  private text(t: { commonName: string; region: string; description: string; careNotes: string }) {
    return {
      commonName: t.commonName.trim(),
      description: t.description.trim(),
      ...(t.region.trim() && { region: t.region.trim() }),
      ...(t.careNotes.trim() && { careNotes: t.careNotes.trim() }),
    };
  }
}
