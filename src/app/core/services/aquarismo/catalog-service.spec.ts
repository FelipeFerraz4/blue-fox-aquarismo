import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../../../environments/environment';
import { CatalogService } from './catalog-service';

describe('CatalogService', () => {
  let spectator: SpectatorService<CatalogService>;
  let http: HttpTestingController;
  const base = `${environment.blogApi.urlBase}${environment.blogApi.request.aquarismo}`;

  const createService = createServiceFactory({
    service: CatalogService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists species with only the filters that were set', () => {
    spectator.service.listSpecies({ temperature: 25, volume: 100, noFinNippers: false, q: '' }, 'en').subscribe();
    const req = http.expectOne((r) => r.url === `${base}/species`);
    expect(req.request.params.get('temperature')).toBe('25');
    expect(req.request.params.get('volume')).toBe('100');
    expect(req.request.params.get('noFinNippers')).toBe('false');
    expect(req.request.params.has('q')).toBe(false);
    expect(req.request.params.get('lang')).toBe('en');
    req.flush([]);
  });

  it('omits lang when not given', () => {
    spectator.service.getSpecies('betta-splendens').subscribe();
    const req = http.expectOne(`${base}/species/slug/betta-splendens`);
    expect(req.request.params.keys()).toEqual([]);
    req.flush({});
  });

  it('checks compatibility with a comma-separated list, keeping repeats', () => {
    spectator.service.checkCompatibility(['betta-splendens', 'betta-splendens']).subscribe((r) => expect(r.level).toBe('INCOMPATIBLE'));
    const req = http.expectOne((r) => r.url === `${base}/compatibility`);
    expect(req.request.params.get('species')).toBe('betta-splendens,betta-splendens');
    req.flush({ locale: 'pt-BR', level: 'INCOMPATIBLE', species: [], pairs: [] });
  });

  it('passes the volume to the equipment listing', () => {
    spectator.service.listEquipment({ type: 'HEATER', volume: 120 }).subscribe();
    const req = http.expectOne((r) => r.url === `${base}/equipment`);
    expect(req.request.params.get('type')).toBe('HEATER');
    expect(req.request.params.get('volume')).toBe('120');
    req.flush([]);
  });

  it('reads families and biomes', () => {
    spectator.service.listFamilies().subscribe();
    spectator.service.getBiome('amazonia', 'en').subscribe();
    http.expectOne(`${base}/families`).flush([]);
    const biome = http.expectOne((r) => r.url === `${base}/biomes/slug/amazonia`);
    expect(biome.request.params.get('lang')).toBe('en');
    biome.flush({});
  });
});
