import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { LanguageService } from '../../../../core/i18n/language-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, DestroyRef, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';

import { PostService } from '../../../../core/services/post/post';
import { Post } from '../../../model/types/post';

/** Campo de busca da navbar com dropdown de resultados (a partir de 2 caracteres). */
@Component({
  selector: 'app-navbar-search',
  imports: [LocalizePipe, TranslatePipe, RouterLink],
  templateUrl: './navbar-search.html',
  styleUrl: './navbar-search.scss',
})
export class NavbarSearch {
  private router = inject(Router);
  private language = inject(LanguageService);
  private postService = inject(PostService);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  searchQuery = signal('');
  searchResults = signal<Post[]>([]);
  isLoading = signal(false);
  isSearchOpen = signal(false);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          if (term.trim().length >= 2) {
            this.isLoading.set(true);
          } else {
            this.searchResults.set([]);
            this.isLoading.set(false);
          }
        }),
        switchMap((term) => {
          const trimmed = term.trim();
          if (trimmed.length < 2) {
            return of([]);
          }
          return this.postService.searchPosts(trimmed, 4);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (posts) => {
          this.searchResults.set(posts);
          this.isLoading.set(false);
        },
        error: () => {
          this.searchResults.set([]);
          this.isLoading.set(false);
        },
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);

    if (value.trim().length >= 2) {
      this.isSearchOpen.set(true);
      this.searchSubject.next(value);
    } else {
      this.isSearchOpen.set(false);
      this.searchResults.set([]);
    }
  }

  onSearchFocus() {
    if (this.searchQuery().trim().length >= 2) {
      this.isSearchOpen.set(true);
    }
  }

  onSearchSubmit() {
    const query = this.searchQuery().trim();
    if (query) {
      this.closeSearch();
      this.router.navigate([this.language.localize('/search')], { queryParams: { q: query } });
    }
  }

  closeSearch() {
    this.isSearchOpen.set(false);
  }
}
