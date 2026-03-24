import { Component } from '@angular/core';
import { PostHeaderType1 } from '../../../../shared/components/post/post-header-type1/post-header-type1';
import { RelatedPosts } from '../../../../shared/components/post/related-posts/related-posts';
import { POST_MOCK } from '../../../../shared/model/mocks/post-mock';
import { Post } from '../../../../shared/model/types/post';

@Component({
  selector: 'app-aquarium-selection-guide',
  standalone: true,
  imports: [PostHeaderType1, RelatedPosts],
  templateUrl: './aquarium-selection-guide.html',
  styleUrl: './aquarium-selection-guide.scss',
})
export class AquariumSelectionGuide {
  currentPost: Post | undefined;

  recommended: Post[] = [];
  latest: Post[] = [];

  ngOnInit(): void {
    this.currentPost = POST_MOCK.find((p) => p.slug === 'articles/aquarium-selection-guide');

    if (this.currentPost) {
      const currentId = this.currentPost.id;

      this.recommended = [POST_MOCK[2], POST_MOCK[3]];

      const allPostsReversed = [...POST_MOCK].filter((p) => p.id !== currentId).reverse();

      const categoryLatest = allPostsReversed
        .filter((p) => p.category === this.currentPost?.category)
        .slice(0, 2);

      const generalLatest = allPostsReversed.filter((p) => !categoryLatest.includes(p)).slice(0, 4);

      this.latest = [...categoryLatest, ...generalLatest];
    }
  }
}
