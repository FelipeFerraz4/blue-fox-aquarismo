import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../../../shared/model/types/post';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-result.html',
  styleUrl: './search-result.scss',
})
export class SearchResult implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private seo = inject(SeoService);
  private destroyRef = inject(DestroyRef);

  isBrowser: boolean;

  query = signal('');
  posts = signal<Post[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  popularTags = ['Betta', 'Filtragem', 'Ciclagem', 'pH', 'Aquário', 'Plantas'];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const q = (params['q'] || '').trim();
        this.query.set(q);
        if (q) {
          this.executeSearch(q);
        } else {
          this.posts.set([]);
          this.hasSearched.set(false);
          this.seo.updateMetadata({
            title: 'Pesquisar Artigos | Blue Fox Aquarismo',
            description: 'Busque artigos, guias e conteúdos sobre aquarismo.',
            url: 'https://bluefoxaquarismo.space/search',
          });
        }
      });
  }

  executeSearch(term: string) {
    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.seo.updateMetadata({
      title: `Busca por "${term}" | Blue Fox Aquarismo`,
      description: `Resultados da pesquisa por "${term}" no acervo do Blue Fox Aquarismo.`,
      url: `https://bluefoxaquarismo.space/search?q=${encodeURIComponent(term)}`,
    });

    this.postService.searchPosts(term, 20).subscribe({
      next: (results) => {
        this.posts.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.posts.set([]);
        this.isLoading.set(false);
      },
    });
  }

  onSearchSubmit(inputVal: string) {
    const trimmed = inputVal.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  searchTag(tag: string) {
    this.router.navigate(['/search'], { queryParams: { q: tag } });
  }
}
