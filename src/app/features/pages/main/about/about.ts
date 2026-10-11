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

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {

  isBrowser: boolean;

  lastPost: Post | undefined = undefined;

  constructor(
    private seo: SeoService,
    private postService: PostService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadLastPost();
    this.setupSeo();
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
      title: "Sobre Blue Fox Aquarismo",
      description: "A Blue Fox Aquarismo é uma plataforma educacional criada para compartilhar conhecimento real e acessível sobre aquários, peixes e plantas aquáticas.",
      image: "https://bluefoxaquarismo.com.br/assets/images/brand/logo.webp",
      url: `https://bluefoxaquarismo.com.br/about`,
    });
  }
}
