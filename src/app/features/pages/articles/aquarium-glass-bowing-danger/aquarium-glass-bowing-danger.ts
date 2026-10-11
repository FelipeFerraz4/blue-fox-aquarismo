import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { PostHeaderType1 } from '../../../../shared/components/post/post-header-type1/post-header-type1';
import { RelatedPosts } from '../../../../shared/components/post/related-posts/related-posts';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

@Component({
  selector: 'app-aquarium-glass-bowing-danger',
  standalone: true,
  imports: [PostHeaderType1, RelatedPosts],
  templateUrl: './aquarium-glass-bowing-danger.html',
  styleUrls: ['./aquarium-glass-bowing-danger.scss', '../articles-style.scss'],
})
export class AquariumGlassBowingDanger implements OnInit, AfterViewInit {
  currentPost?: Post;
  recommended: Post[] = [];
  latest: Post[] = [];

  @ViewChild('videoPlayer') video!: ElementRef<HTMLVideoElement>;
  private observer!: IntersectionObserver;

  constructor(
    private seoService: SeoService,
    private postService: PostService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    const slug = 'aquarium-glass-bowing-danger';

    this.loadPost(slug);
    this.loadRecommendedPosts(slug);
    this.loadNextPost(slug);
  }

  loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe({
      next: (post: Post) => {
        this.currentPost = post;

        this.setupSeo(post);
        this.incrementPostViews(slug);
      },
      error: (err) => {
        console.error('Error fetching post by slug', err);
      }
    });
  }

  incrementPostViews(slug: string) {
    this.postService.incrementViews(slug).subscribe({
      next: () => {
        if (this.currentPost) {
          this.currentPost.views++;
        }
      },
      error: (err) => {
        console.error('Failed to increment views', err);
      }
    });
  }

  loadRecommendedPosts(slug: string) {
    this.postService.getRecommendedPosts(slug).subscribe({
      next: (recommended: Post[]) => {
        this.recommended = recommended;
      },
      error: (err) => {
        console.error('Error fetching recommended posts', err);
      }
    });
  }

  loadNextPost(slug: string) {
    this.postService.getNextPost(slug).subscribe({
      next: (nextPost: Post[]) => {
        this.latest = nextPost;
      },
      error: (err) => {
        console.error('Error fetching next post', err);
      }
    });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const videoEl = this.video.nativeElement;

    videoEl.muted = true;
    videoEl.volume = 0;

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        videoEl.play().catch(() => { void 0 });
      } else {
        videoEl.pause();
      }
    });

    this.observer.observe(videoEl);
  }

  setupSeo(post: Post) {
    this.seoService.updateMetadata({
      title: post.title,
      description: post.description,
      image: post.imageUrl,
      url: `https://bluefoxaquarismo.com.br/articles/${post.slug}`,
    });
  }

}
