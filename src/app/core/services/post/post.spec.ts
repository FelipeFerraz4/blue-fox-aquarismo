import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from './post';
import { Post } from '../../../shared/model/types/post';
import { Status } from '../../../shared/model/types/status';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const dummyPost: Post = {
    id: '1',
    title: 'Test Post',
    description: 'Test Description',
    imageUrl: 'test.png',
    slug: 'test-post',
    views: 10,
    published: true,
    status: Status.PUBLISHED,
    publishedAt: '2026-01-01',
    readingTime: '10 min',
    likes: 10,
    recommendedPostIds: [],

    authorId: '1',
    authorName: 'Author',
    categoryId: '1',
    categoryName: 'Category',

    createdAt: "",
    updatedAt: ""
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch post by slug', () => {
    service.getPostBySlug('test-post').subscribe(post => {
      expect(post).toEqual(dummyPost);
    });

    const req = httpMock.expectOne(req => req.url.endsWith('/slug/test-post'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should fetch most relevance posts', () => {
    service.getMostRelevancePost(4).subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0]).toEqual(dummyPost);
    });

    const req = httpMock.expectOne(req => req.urlWithParams.includes('/most-relevance?limit=4'));
    expect(req.request.method).toBe('GET');
    req.flush([dummyPost]);
  });

  it('should fetch last post', () => {
    service.getLastPost().subscribe(post => {
      expect(post).toEqual(dummyPost);
    });

    const req = httpMock.expectOne(req => req.url.endsWith('/last-post'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should fetch latest posts with limit', () => {
    service.getLatestPosts(6).subscribe(posts => {
      expect(posts.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.includes('/latest?limit=6'));
    expect(req.request.method).toBe('GET');
    req.flush([dummyPost]);
  });

  it('should fetch recommended posts', () => {
    service.getRecommendedPosts('test-post').subscribe(posts => {
      expect(posts.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.endsWith('/recommended-posts/test-post'));
    expect(req.request.method).toBe('GET');
    req.flush([dummyPost]);
  });

  it('should fetch next posts', () => {
    service.getNextPost('test-post').subscribe(posts => {
      expect(posts.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.endsWith('/next-posts/test-post'));
    expect(req.request.method).toBe('GET');
    req.flush([dummyPost]);
  });

  it('should increment views', () => {
    service.incrementViews('test-post').subscribe();

    const req = httpMock.expectOne(req => req.url.endsWith('/views/test-post'));
    expect(req.request.method).toBe('PATCH');
    req.flush(null);
  });
});