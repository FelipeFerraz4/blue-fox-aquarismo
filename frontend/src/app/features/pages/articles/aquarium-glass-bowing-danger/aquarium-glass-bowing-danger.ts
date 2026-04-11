import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
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
export class AquariumGlassBowingDanger implements OnInit {
  currentPost?: Post;
  recommended: Post[] = [];
  latest: Post[] = [];

  @ViewChild('videoPlayer') video!: ElementRef<HTMLVideoElement>;
  private observer!: IntersectionObserver;

  constructor(
    private seoService: SeoService,
    private postService: PostService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadPostData('aquarium-glass-bowing-danger', ['1', '2']);

    this.setupSeo();
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const videoEl = this.video.nativeElement;

    videoEl.muted = true;
    videoEl.volume = 0;

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        videoEl.play().catch(() => { });
      } else {
        videoEl.pause();
      }
    });

    this.observer.observe(videoEl);
  }

  loadPostData(slug: string, recommendedIds: string[]) {
    const postData = this.postService.getPostPageData(slug, recommendedIds);

    if (!postData) return;

    this.currentPost = postData.post;
    this.recommended = postData.recommended;
    this.latest = postData.latest;
  }

  setupSeo() {
    this.seoService.updateMetadata({
      title: this.currentPost!.title,
      description: this.currentPost!.description,
      image: this.currentPost!.image,
      url: `https://bluefoxaquarismo.com.br/articles/${this.currentPost!.slug}`,
    });
  }

}
