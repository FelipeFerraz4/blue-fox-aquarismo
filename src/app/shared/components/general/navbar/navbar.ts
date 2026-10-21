import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { PostService } from '../../../../core/services/post/post';
import { Post } from '../../../model/types/post';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private postService = inject(PostService);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  menuOpen = false;
  artigosOpen = false;
  ferramentasOpen = false;

  // Estados reativos da busca
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
    const input = event.target as HTMLInputElement;
    const value = input.value;
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
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  closeSearch() {
    this.isSearchOpen.set(false);
  }

  selectPost(slug: string) {
    this.closeSearch();
    this.router.navigate(['/articles', slug]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (!this.menuOpen) {
      this.artigosOpen = false;
      this.ferramentasOpen = false;
    }
  }

  toggleArtigos() {
    if (this.artigosOpen) {
      this.artigosOpen = false;
    } else {
      this.artigosOpen = true;
      this.ferramentasOpen = false;
    }
  }

  toggleFerramentas() {
    if (this.ferramentasOpen) {
      this.ferramentasOpen = false;
    } else {
      this.ferramentasOpen = true;
      this.artigosOpen = false;
    }
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
