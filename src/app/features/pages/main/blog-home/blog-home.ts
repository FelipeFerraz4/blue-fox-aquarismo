import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { LatestPosts } from '../../../../shared/components/post/latest-posts/latest-posts';
import { FeaturedPost } from '../../../../shared/components/post/featured-post/featured-post';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LatestPosts,
    FeaturedPost
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './blog-home.html',
  styleUrl: './blog-home.scss',
})
export class BlogHome implements OnInit {

  isBrowser: boolean;

  latest: Post[] = [];
  featuredPosts: Post[] = [];
  lastPost: Post | undefined = undefined;

  constructor(
    private seo: SeoService,
    private postService: PostService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  slides = [
    {
      id: 1,
      image: 'assets/images/aquariums/aquarium5.webp',
      title: 'Aprenda sobre Aquarismo',
      description: 'Guias práticos e experiências reais.',
      button: {
        text: 'Ver Artigos',
        link: '/articles/guides'
      }
    },
    {
      id: 2,
      image: 'assets/images/aquariums/maintenance-aquarium.webp',
      title: 'Monte seu Aquário com Segurança',
      description: 'Evite erros comuns e cuide melhor dos peixes.',
      button: {
        text: 'Ver Artigos',
        link: '/articles/montage'
      }
    },
    {
      id: 3,
      image: 'assets/images/aquariums/learning-aquariums.webp',
      title: 'Divirta-se com as Ferramentas Educativas sobre Aquarismo',
      description: 'Aprenda de forma interativa.',
      button: {
        text: 'Ver Ferramentas',
        link: '/articles/tools'
      }
    },
    {
      id: 4,
      image: 'assets/images/aquariums/aquarium5.webp',
      title: 'Aprenda sobre Aquarismo',
      description: 'Guias práticos e experiências reais.',
      button: {
        text: 'Ver Artigos',
        link: '/articles/guides'
      }
    },
    {
      id: 5,
      image: 'assets/images/aquariums/maintenance-aquarium.webp',
      title: 'Monte seu Aquário com Segurança',
      description: 'Evite erros comuns e cuide melhor dos peixes.',
      button: {
        text: 'Ver Artigos',
        link: '/articles/montage'
      }
    },
    {
      id: 6,
      image: 'assets/images/aquariums/learning-aquariums.webp',
      title: 'Divirta-se com as Ferramentas Educativas sobre Aquarismo',
      description: 'Aprenda de forma interativa.',
      button: {
        text: 'Ver Ferramentas',
        link: '/articles/tools'
      }
    }
  ];

  ngOnInit(): void {
    this.setupSeo();
    this.loadFeaturedPost();
    this.loadLatestPosts();
    this.loadLastPost();
  }

  loadFeaturedPost() {
    this.postService.getMostRelevancePost(4).subscribe({
      next: (posts: Post[]) => {
        this.featuredPosts = posts; 
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
      },
      error: (err) => {
        console.error('Error fetching latest posts', err);
      }
    });
  }

  loadLastPost() {
    this.postService.getLastPost().subscribe({
      next: (post: Post) => {
        this.lastPost = post;
      },
      error: (err) => {
        console.error('Error fetching last post', err);
      }
    });
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: "Blue Fox Aquarismo",
      description: "A Blue Fox Aquarismo é uma plataforma educacional criada para compartilhar conhecimento real e acessível sobre aquários, peixes e plantas aquáticas.",
      image: this.slides[0].image,
      url: `https://bluefoxaquarismo.com.br/`,
    });
  }
}
