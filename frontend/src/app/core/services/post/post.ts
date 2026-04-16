import { Injectable } from '@angular/core';
import { POST_MOCK } from '../../../shared/model/mocks/post-mock';
import { CATEGORY_MOCK } from '../../../shared/model/mocks/category-mock';
import { Post, PostPageData, SearchPostById, SearchPostBySlug } from '../../../shared/model/types/post';
import { Category } from '../../../shared/model/types/category';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  getPostPageData(slug: string, recommendedIds: string[]): PostPageData | null {
    const post = this.getPostBySlug(slug);
    if (!post) return null;

    return {
      post,
      recommended: this.getRecommendedPosts(recommendedIds),
      latest: this.getLatestPosts(post, recommendedIds),
    };
  }

  getPostBySlug(slug: string): Post {
    return SearchPostBySlug(POST_MOCK, slug);
  }

  getRecommendedPosts(ids: string[]): Post[] {
    return ids
      .map((id) => SearchPostById(POST_MOCK, id))
      .filter((post): post is Post => !!post);
  }

  getLatestPosts(currentPost: Post, recommendedIds: string[]): Post[] {
    const allPostsReversed = [...POST_MOCK]
      .filter((p) => p.id !== currentPost.id)
      .filter((p) => !recommendedIds.includes(p.id))
      .reverse();

    const categoryLatest = allPostsReversed
      .filter((p) => p.category === currentPost.category)
      .slice(0, 2);

    const postCount = 6 - categoryLatest.length;

    const generalLatest = allPostsReversed
      .filter((p) => !categoryLatest.includes(p))
      .slice(0, postCount);

    return [...categoryLatest, ...generalLatest];
  }

  getAllPosts(): Post[] {
    return POST_MOCK;
  }

  getAllCategories(): Category[] {
    return CATEGORY_MOCK;
  }
}