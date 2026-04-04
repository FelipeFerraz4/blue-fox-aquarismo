import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    updateMetadata(data: {
        title: string;
        description: string;
        image?: string;
        url: string;
        type?: string;
    }) {
        const { title, description, image, url, type = 'article' } = data;

        // Title - Standard SEO
        this.titleService.setTitle(title);

        // Description - Standard SEO
        this.metaService.updateTag({ name: 'description', content: description });

        // Open Graph - Social Media
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:image', content: image || '' });
        this.metaService.updateTag({ property: 'og:type', content: type });
        this.metaService.updateTag({ property: 'og:url', content: url });

        // Twitter
        this.metaService.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image',
        });

        // Canonical - SEO
        this.updateCanonicalUrl(url);
    }

    private updateCanonicalUrl(url: string) {
        if (isPlatformBrowser(this.platformId)) {
            let link: HTMLLinkElement | null =
                document.querySelector("link[rel='canonical']");

            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }

            link.setAttribute('href', url);
        }
    }
}