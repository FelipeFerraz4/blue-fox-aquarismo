import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { LatestPosts } from '../../../../shared/components/post/latest-posts/latest-posts';
import { FeaturedPost } from '../../../../shared/components/post/featured-post/featured-post';
import { ImageCarousel } from '../../../../shared/components/general/image-carousel/image-carousel';
import { CarouselSlide } from '../../../../shared/model/types/carousel-slide';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [LocalizePipe, TranslatePipe, 
    CommonModule,
    RouterModule,
    LatestPosts,
    FeaturedPost,
    ImageCarousel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.scss',
})
export class BlogHome implements OnInit {
  private readonly translate = inject(TranslateService);

  isBrowser: boolean;

  latest: Post[] = [];
  featuredPosts: Post[] = [];

  constructor(
    private seo: SeoService,
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Textos são chaves de tradução (HOME.SLIDE*). Os links antigos (/articles/guides, /montage, /tools)
   * davam 404: os artigos ficam na busca, e as ferramentas ainda não existem (fase 9), então o 3º slide
   * apresenta o projeto.
   */
  slides: CarouselSlide[] = [
    {
      id: 1,
      image: 'assets/images/aquariums/aquarium5.webp',
      title: 'HOME.SLIDE1_TITLE',
      description: 'HOME.SLIDE1_TEXT',
      button: { text: 'HOME.SLIDE_SEE_ARTICLES', link: '/search' },
    },
    {
      id: 2,
      image: 'assets/images/aquariums/maintenance-aquarium.webp',
      title: 'HOME.SLIDE2_TITLE',
      description: 'HOME.SLIDE2_TEXT',
      button: { text: 'HOME.SLIDE_SEE_ARTICLES', link: '/search' },
    },
    {
      id: 3,
      image: 'assets/images/aquariums/learning-aquariums.webp',
      title: 'HOME.SLIDE3_TITLE',
      description: 'HOME.SLIDE3_TEXT',
      button: { text: 'HOME.SLIDE_KNOW_PROJECT', link: '/about' },
    },
  ];

  ngOnInit(): void {
    this.setupSeo();
    this.loadFeaturedPost();
    this.loadLatestPosts();
  }

  loadFeaturedPost() {
    this.postService.getMostRelevancePost(4).subscribe({
      next: (posts: Post[]) => {
        this.featuredPosts = posts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching relevant posts', err);
      }
    });
  }

  loadLatestPosts() {
    this.postService.getLatestPosts(6).subscribe({
      next: (posts: Post[]) => {
        this.latest = posts;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching latest posts', err);
      }
    });
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: this.translate.instant('META.HOME_TITLE'),
      description: this.translate.instant('META.HOME_DESCRIPTION'),
      image: this.slides[0].image,
      url: `https://bluefoxaquarismo.space/`,
    });
  }
}
