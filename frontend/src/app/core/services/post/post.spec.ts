import { TestBed } from '@angular/core/testing';
import { PostService } from './post';
import { POST_MOCK } from '../../../shared/model/mocks/post-mock';

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a post by slug', () => {
    const post = service.getPostBySlug('aquarium-size');

    expect(post).toBeTruthy();
    expect(post?.slug).toBe('aquarium-size');
  });

  it('should return undefined for invalid slug', () => {
    const post = service.getPostBySlug('invalid-slug');

    expect(post).toBeUndefined();
  });

  it('should return recommended posts by ids', () => {
    const posts = service.getRecommendedPosts(['1', '3']);

    expect(posts.length).toBe(2);
    expect(posts[0]).toBeTruthy();
  });

  it('should filter invalid recommended ids', () => {
    const posts = service.getRecommendedPosts(['1', '999']);

    expect(posts.length).toBe(1);
  });

  it('should return latest posts excluding current post', () => {
    const currentPost = POST_MOCK[0];
    const recommendedIds = ['1', '3'];
    const latest = service.getLatestPosts(currentPost, recommendedIds);

    expect(latest.length).toBeGreaterThan(0);
    expect(latest.find(p => p.id === currentPost.id)).toBeFalsy();
    expect(latest.find(p => recommendedIds.includes(p.id))).toBeFalsy();
  });

  it('should return full post page data', () => {
    const data = service.getPostPageData('aquarium-size', ['1', '3']);

    expect(data).toBeTruthy();
    expect(data?.post.slug).toBe('aquarium-size');
    expect(data?.recommended.length).toBe(2);
    expect(data?.latest.length).toBeGreaterThan(0);
  });

  it('should return null if post not found', () => {
    const data = service.getPostPageData('invalid-slug', ['1']);

    expect(data).toBeNull();
  });
});