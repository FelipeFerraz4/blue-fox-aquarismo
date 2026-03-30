import { Component } from '@angular/core';
import { PostHeaderType1 } from '../../../../shared/components/post/post-header-type1/post-header-type1';
import { RelatedPosts } from '../../../../shared/components/post/related-posts/related-posts';
import { POST_MOCK } from '../../../../shared/model/mocks/post-mock';
import { Post, SearchPostById, SearchPostBySlug } from '../../../../shared/model/types/post';

@Component({
  selector: 'app-aquarium-size',
  imports: [PostHeaderType1, RelatedPosts],
  templateUrl: './aquarium-size.html',
  styleUrls: ['./aquarium-size.scss', '../articles-style.scss'],
})
export class AquariumSize {
  currentPost: Post | undefined;

  recommended: Post[] = [];
  latest: Post[] = [];

  ngOnInit(): void {
    this.currentPost = SearchPostBySlug(POST_MOCK, 'aquarium-size');

    if (this.currentPost) {
      const currentId = this.currentPost.id;

      this.recommended.push(SearchPostById(POST_MOCK, '1')!);
      this.recommended.push(SearchPostById(POST_MOCK, '3')!);

      const allPostsReversed = [...POST_MOCK].filter((p) => p.id !== currentId).reverse();

      const categoryLatest = allPostsReversed
        .filter((p) => p.category === this.currentPost?.category)
        .slice(0, 2);

      const generalLatest = allPostsReversed.filter((p) => !categoryLatest.includes(p)).slice(0, 4);

      this.latest = [...categoryLatest, ...generalLatest];
    }
  }
}
