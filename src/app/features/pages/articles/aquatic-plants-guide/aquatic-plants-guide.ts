import { Component, OnInit } from '@angular/core';
import { PostHeaderType1 } from '../../../../shared/components/post/post-header-type1/post-header-type1';
import { RelatedPosts } from '../../../../shared/components/post/related-posts/related-posts';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

@Component({
  selector: 'app-aquatic-plants-guide',
  standalone: true,
  imports: [PostHeaderType1, RelatedPosts],
  templateUrl: './aquatic-plants-guide.html',
  styleUrls: ['./aquatic-plants-guide.scss', '../articles-style.scss'],
})
export class AquaticPlantsGuide implements OnInit {
  currentPost?: Post;
  recommended: Post[] = [];
  latest: Post[] = [];

  constructor(
    private seo: SeoService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    const slug = 'aquatic-plants-guide';

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

  setupSeo(post: Post) {
    this.seo.updateMetadata({
      title: post.title,
      description: post.description,
      image: post.imageUrl,
      url: `https://bluefoxaquarismo.com.br/articles/${post.slug}`,
    });
  }
}
