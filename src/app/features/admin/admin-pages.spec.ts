import { ActivatedRoute, provideRouter } from '@angular/router';
import { createComponentFactory, mockProvider, SpyObject } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { AdminApiService } from '../../core/services/admin/admin-api-service';
import { AuthService } from '../../core/services/auth/auth-service';
import { Species } from '../../shared/model/types/aquarismo';
import { Report } from '../../shared/model/types/report';
import { AdminReports } from './reports/admin-reports';
import { AdminSpeciesEdit } from './species-edit/admin-species-edit';

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

const report: Report = {
  id: 'r1',
  targetType: 'SPECIES',
  targetSlug: 'betta-splendens',
  targetTitle: 'Betta',
  message: 'A temperatura máxima está errada.',
  status: 'NEW',
  internalNote: null,
  resolvedAt: null,
  createdAt: '2026-11-20T10:00:00.000Z',
  updatedAt: '2026-11-20T10:00:00.000Z',
};

describe('AdminReports', () => {
  const createComponent = createComponentFactory({
    component: AdminReports,
    providers: [
      provideRouter([]),
      mockProvider(AuthService, { hasAnyRole: () => false }),
      mockProvider(AdminApiService, {
        listReports: jest.fn(() => of([report])),
        updateReport: jest.fn((_id: string, c: Partial<Report>) => of({ ...report, ...c })),
      }),
    ],
  });

  it('loads new reports by default and links species reports to the editor', () => {
    const spectator = createComponent();
    const api = spectator.inject(AdminApiService) as SpyObject<AdminApiService>;
    expect(api.listReports).toHaveBeenCalledWith({ status: 'NEW' });
    expect(spectator.query('.report-title a')?.getAttribute('href')).toBe('/admin/catalog/species/betta-splendens');
    expect(spectator.query('.btn.danger')).toBeNull(); // só admin exclui
  });

  it('saves status and internal note', () => {
    const spectator = createComponent();
    const api = spectator.inject(AdminApiService) as SpyObject<AdminApiService>;
    spectator.component.updateDraft('r1', { status: 'FIXED', internalNote: 'Corrigido na ficha.' });
    spectator.component.save(report);
    spectator.detectChanges();
    expect(api.updateReport).toHaveBeenCalledWith('r1', { status: 'FIXED', internalNote: 'Corrigido na ficha.' });
    expect(spectator.query('.status-line')?.textContent).toContain('Corrigido');
  });
});

describe('AdminSpeciesEdit', () => {
  const betta = {
    id: 's1',
    slug: 'betta-splendens',
    locale: 'pt-BR',
    scientificName: 'Betta splendens',
    commonName: 'Betta',
    region: null,
    description: 'Descrição em português.',
    careNotes: null,
    adultSizeCm: 6,
    minVolumeL: 15,
    minTankLengthCm: 30,
    minGroupSize: 1,
    tempMinC: 24,
    tempMaxC: 28,
    phMin: 6,
    phMax: 7.5,
    ghMin: 2,
    ghMax: 12,
    temperament: 'SEMI_AGGRESSIVE',
    maleTemperament: 'AGGRESSIVE',
    difficulty: 'BEGINNER',
    diet: 'CARNIVORE',
    layers: ['SURFACE', 'MIDDLE'],
    publication: 'REVIEWED',
    family: null,
  } as unknown as Species;

  const createComponent = createComponentFactory({
    component: AdminSpeciesEdit,
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['slug', 'betta-splendens']]) } } },
      mockProvider(AdminApiService, {
        // Sem tradução em inglês: a API devolve o pt-BR (fallback).
        getSpecies: jest.fn(() => of(betta)),
        updateSpecies: jest.fn((_id: string, c: Partial<Species>) => of({ ...betta, ...c })),
      }),
    ],
  });

  it('fills the form and leaves English empty when it fell back to pt-BR', () => {
    const spectator = createComponent();
    expect(spectator.component.form.controls.tempMaxC.value).toBe(28);
    expect(spectator.component.form.controls.maleTemperament.value).toBe('AGGRESSIVE');
    expect(spectator.component.form.controls.en.controls.commonName.value).toBe('');
  });

  it('saves the correction, clears emptied values and can mark as reviewed', () => {
    const spectator = createComponent();
    const api = spectator.inject(AdminApiService) as SpyObject<AdminApiService>;
    spectator.component.form.patchValue({ tempMaxC: 27, ghMax: null, maleTemperament: '', markReviewed: true, publication: 'PUBLISHED' });
    spectator.component.save();
    const [id, payload] = api.updateSpecies.mock.calls[0];
    expect(id).toBe('s1');
    expect(payload).toMatchObject({ tempMaxC: 27, ghMax: null, maleTemperament: null, publication: 'PUBLISHED' });
    expect(payload.lastReviewedAt).toEqual(expect.any(String));
    expect(payload.translations).toEqual([{ locale: 'pt-BR', commonName: 'Betta', description: 'Descrição em português.' }]);
    expect(payload).not.toHaveProperty('markReviewed');
  });

  it('blocks a minimum above the maximum', () => {
    const spectator = createComponent();
    const api = spectator.inject(AdminApiService) as SpyObject<AdminApiService>;
    spectator.component.form.patchValue({ tempMinC: 30, tempMaxC: 25 });
    spectator.component.save();
    expect(api.updateSpecies).not.toHaveBeenCalled();
    expect(spectator.component.status()?.ok).toBe(false);
  });
});
