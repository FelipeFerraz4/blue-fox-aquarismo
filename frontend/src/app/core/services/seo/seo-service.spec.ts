import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Title, Meta } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';

import { SeoService } from './seo-service';

describe('SeoService', () => {
    let spectator: SpectatorService<SeoService>;
    let service: SeoService;
    let titleService: Title;
    let metaService: Meta;

    const createService = createServiceFactory({
        service: SeoService,
        providers: [
            { provide: PLATFORM_ID, useValue: 'browser' } // 🔑 garante execução do DOM
        ]
    });

    beforeEach(() => {
        spectator = createService();
        service = spectator.service;
        titleService = spectator.inject(Title);
        metaService = spectator.inject(Meta);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should update metadata correctly', () => {
        const data = {
            title: 'Test Title',
            description: 'Test Description',
            image: 'test.jpg',
            url: 'https://test.com',
        };

        service.updateMetadata(data);

        expect(titleService.getTitle()).toBe(data.title);

        expect(metaService.getTag("name='description'")?.content)
            .toBe(data.description);

        expect(metaService.getTag("property='og:title'")?.content)
            .toBe(data.title);

        expect(metaService.getTag("property='og:description'")?.content)
            .toBe(data.description);

        expect(metaService.getTag("property='og:image'")?.content)
            .toBe(data.image);

        expect(metaService.getTag("property='og:type'")?.content)
            .toBe('article');

        expect(metaService.getTag("property='og:url'")?.content)
            .toBe(data.url);

        expect(metaService.getTag("name='twitter:card'")?.content)
            .toBe('summary_large_image');
    });

    it('should create canonical link if not exists', () => {
        const url = 'https://test.com';

        const existing = document.querySelector("link[rel='canonical']");
        if (existing) existing.remove();

        service.updateMetadata({
            title: 'Test',
            description: 'Desc',
            url
        });

        const link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

        expect(link).toBeTruthy();
        expect(link.getAttribute('href')).toBe(url);
    });

    it('should update canonical link if exists', () => {
        const url = 'https://updated.com';

        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', 'old-url');
        document.head.appendChild(link);

        service.updateMetadata({
            title: 'Test',
            description: 'Desc',
            url
        });

        const updatedLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

        expect(updatedLink.getAttribute('href')).toBe(url);
    });
});