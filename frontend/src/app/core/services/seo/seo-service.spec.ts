import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo-service';
import { PLATFORM_ID } from '@angular/core';

describe('SeoService', () => {
    let service: SeoService;
    let titleService: Title;
    let metaService: Meta;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(SeoService);
        titleService = TestBed.inject(Title);
        metaService = TestBed.inject(Meta);
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

        expect(titleService.getTitle()).toBeTruthy();
        expect(titleService.getTitle()).toBe(data.title);
        expect(metaService.getTag("name='description'")).toBeTruthy();
        expect(metaService.getTag("name='description'")?.content).toBe(data.description);
        expect(metaService.getTag("property='og:title'")).toBeTruthy();
        expect(metaService.getTag("property='og:title'")?.content).toBe(data.title);
        expect(metaService.getTag("property='og:description'")).toBeTruthy();
        expect(metaService.getTag("property='og:description'")?.content).toBe(data.description);
        expect(metaService.getTag("property='og:image'")).toBeTruthy();
        expect(metaService.getTag("property='og:image'")?.content).toBe(data.image);
        expect(metaService.getTag("property='og:type'")).toBeTruthy();
        expect(metaService.getTag("property='og:type'")?.content).toBe('article');
        expect(metaService.getTag("property='og:url'")).toBeTruthy();
        expect(metaService.getTag("property='og:url'")?.content).toBe(data.url);
        expect(metaService.getTag("name='twitter:card'")?.content).toBe('summary_large_image');
    });
});