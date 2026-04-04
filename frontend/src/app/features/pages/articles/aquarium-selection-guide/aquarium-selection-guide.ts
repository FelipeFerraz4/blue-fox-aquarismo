import { Component, OnInit } from '@angular/core';
import { PostHeaderType1 } from '../../../../shared/components/post/post-header-type1/post-header-type1';
import { RelatedPosts } from '../../../../shared/components/post/related-posts/related-posts';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

@Component({
  selector: 'app-aquarium-selection-guide',
  standalone: true,
  imports: [PostHeaderType1, RelatedPosts],
  templateUrl: './aquarium-selection-guide.html',
  styleUrl: './aquarium-selection-guide.scss',
})
export class AquariumSelectionGuide implements OnInit {
  currentPost?: Post;
  recommended: Post[] = [];
  latest: Post[] = [];

  constructor(
    private seo: SeoService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.loadPostData('aquarium-selection-guide', ['2', '3']);

    this.setupSeo();
  }


  loadPostData(slug: string, recommendedIds: string[]) {
    const postData = this.postService.getPostPageData(slug, recommendedIds);

    if (!postData) return;

    this.currentPost = postData.post;
    this.recommended = postData.recommended;
    this.latest = postData.latest;
  }

  setupSeo() {
    this.seo.updateMetadata({
      title: this.currentPost!.title,
      description: this.currentPost!.description,
      image: this.currentPost!.image,
      url: `https://bluefoxaquarismo.com.br/articles/${this.currentPost!.slug}`,
    });
  }
}
