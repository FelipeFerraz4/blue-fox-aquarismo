import { TranslateService } from '@ngx-translate/core';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { LanguageService } from '../../../../core/i18n/language-service';
import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [LocalizePipe, LocalDatePipe, TranslatePipe, CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-result.html',
  styleUrl: './search-result.scss',
})
export class SearchResult implements OnInit {
  private readonly translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private language = inject(LanguageService);
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
            title: this.translate.instant('META.SEARCH_TITLE'),
            description: this.translate.instant('META.SEARCH_DESCRIPTION'),
            url: 'https://bluefoxaquarismo.space/search',
          });
        }
      });
  }

  executeSearch(term: string) {
    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.seo.updateMetadata({
      title: this.translate.instant('META.SEARCH_TERM_TITLE', { term }),
      description: this.translate.instant('META.SEARCH_TERM_DESCRIPTION', { term }),
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
      this.router.navigate([this.language.localize('/search')], { queryParams: { q: trimmed } });
    }
  }

  searchTag(tag: string) {
    this.router.navigate([this.language.localize('/search')], { queryParams: { q: tag } });
  }
}
