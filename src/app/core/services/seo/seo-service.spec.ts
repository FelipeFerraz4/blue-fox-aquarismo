import { PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LanguageService } from '../../i18n/language-service';
import { SeoService } from './seo-service';

const href = (selector: string) => document.head.querySelector(selector)?.getAttribute('href');

describe('SeoService', () => {
  let spectator: SpectatorService<SeoService>;
  let meta: Meta;

  const createService = createServiceFactory({
    service: SeoService,
    providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideRouter([])],
  });

  beforeEach(() => {
    document.head.querySelectorAll('link').forEach((l) => l.remove());
    spectator = createService();
    meta = spectator.inject(Meta);
  });

  it('sets title, description, Open Graph and Twitter tags', () => {
    spectator.service.updateMetadata({
      title: 'Test Title',
      description: 'Test Description',
      image: 'test.jpg',
      url: 'https://bluefoxaquarismo.space/about',
    });

    expect(spectator.inject(Title).getTitle()).toBe('Test Title');
    expect(meta.getTag("name='description'")?.content).toBe('Test Description');
    expect(meta.getTag("property='og:title'")?.content).toBe('Test Title');
    expect(meta.getTag("property='og:description'")?.content).toBe('Test Description');
    expect(meta.getTag("property='og:image'")?.content).toBe('test.jpg');
    expect(meta.getTag("property='og:type'")?.content).toBe('article');
    expect(meta.getTag("property='og:url'")?.content).toBe('https://bluefoxaquarismo.space/about');
    expect(meta.getTag("property='og:locale'")?.content).toBe('pt_BR');
    expect(meta.getTags("property='og:locale:alternate'").map((t) => t.content)).toEqual(['en_US']);
    expect(meta.getTag("name='twitter:card'")?.content).toBe('summary_large_image');
  });

  it('creates the canonical and the hreflang alternates (pt-BR)', () => {
    spectator.service.updateMetadata({ title: 'T', description: 'D', url: 'https://bluefoxaquarismo.space/about' });

    expect(href("link[rel='canonical']")).toBe('https://bluefoxaquarismo.space/about');
    expect(href("link[hreflang='pt-BR']")).toBe('https://bluefoxaquarismo.space/about');
    expect(href("link[hreflang='en']")).toBe('https://bluefoxaquarismo.space/en/about');
    expect(href("link[hreflang='x-default']")).toBe('https://bluefoxaquarismo.space/about');
  });

  it('uses the English URL as canonical in English and replaces old links', () => {
    spectator.service.updateMetadata({ title: 'T', description: 'D', url: '/' });
    spectator.inject(LanguageService).current.set('en');
    spectator.service.updateMetadata({ title: 'T', description: 'D', url: 'https://bluefoxaquarismo.space/' });

    expect(document.head.querySelectorAll("link[rel='canonical']")).toHaveLength(1);
    expect(document.head.querySelectorAll("link[rel='alternate'][hreflang]")).toHaveLength(3);
    expect(href("link[rel='canonical']")).toBe('https://bluefoxaquarismo.space/en');
    expect(href("link[hreflang='pt-BR']")).toBe('https://bluefoxaquarismo.space/');
    expect(meta.getTag("property='og:locale'")?.content).toBe('en_US');
  });
});
