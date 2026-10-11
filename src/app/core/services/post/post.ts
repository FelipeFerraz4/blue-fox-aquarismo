import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Post } from '../../../shared/model/types/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  private postsApiUrl = `${environment.blogApi.urlBase}${environment.blogApi.request.post}`;
  private categoriesApiUrl = `${environment.blogApi.urlBase}${environment.blogApi.request.category}`;

  /**
   * Search for a specific post by its unique slug.
   */
  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsApiUrl}/slug/${slug}`);
  }

  /**
   * Search for the most relevant posts based on a specific criterion (e.g., views, likes, etc.).
   * @param limit The maximum number of relevant posts to retrieve. Default is 4.
   * @returns An Observable emitting an array of the most relevant posts.
   */
  getMostRelevancePost(limit: number = 4): Observable<Post[]> {
    const url = `${environment.blogApi.urlBase}${environment.blogApi.request.post}/most-relevance`;

    // Passa o limite como parâmetro de consulta (?limit=4)
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Post[]>(url, { params });
  }

  /**
   * Finds the most recently published post
   * @returns An Observable emitting the most recently published post.
   */
  getLastPost(): Observable<Post> {
    return this.http.get<Post>(`${this.postsApiUrl}/last-post`);
  }

  /**
   * Finds the latest posts, with an optional limit on the number of posts returned.
   * @param limit The maximum number of latest posts to retrieve. Default is 6.
   * @returns An Observable emitting an array of the latest posts.
   */
  getLatestPosts(limit: number = 6): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/latest?limit=${limit}`);
  }

  getRecommendedPosts(slug: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/recommended-posts/${slug}`);
  }

  getNextPost(slug: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsApiUrl}/next-posts/${slug}`);
  }

  incrementViews(slug: string): Observable<void> {
    return this.http.patch<void>(`${this.postsApiUrl}/views/${slug}`, {});
  }
}