import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { PostService } from '../../../../core/services/post/post';
import { Post } from '../../../model/types/post';
import { NavbarSearch } from './navbar-search';

describe('NavbarSearch', () => {
  let spectator: Spectator<NavbarSearch>;
  const posts = [{ id: '1', slug: 'tetra-fish-guide', title: 'Tetra', description: 'Guia' }] as Post[];
  const postService = { searchPosts: jest.fn().mockReturnValue(of(posts)) };

  const createComponent = createComponentFactory({
    component: NavbarSearch,
    imports: [RouterTestingModule],
    providers: [{ provide: PostService, useValue: postService }],
  });

  const type = (value: string) => spectator.typeInElement(value, 'input.search-input');

  beforeEach(() => {
    postService.searchPosts.mockClear();
    spectator = createComponent();
  });

  it('does not search with less than 2 characters', fakeAsync(() => {
    type('a');
    tick(300);
    expect(postService.searchPosts).not.toHaveBeenCalled();
    expect(spectator.component.isSearchOpen()).toBe(false);
  }));

  it('searches after the debounce and shows the results', fakeAsync(() => {
    type('tetra');
    tick(300);
    spectator.detectChanges();
    expect(postService.searchPosts).toHaveBeenCalledWith('tetra', 4);
    expect(spectator.queryAll('.search-card-item')).toHaveLength(1);
  }));

  it('navigates to the search page on submit', () => {
    const navigate = jest.spyOn(spectator.inject(Router), 'navigate').mockResolvedValue(true);
    spectator.component.searchQuery.set('  betta ');
    spectator.component.onSearchSubmit();
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'betta' } });
    expect(spectator.component.isSearchOpen()).toBe(false);
  });

  it('closes when clicking outside', () => {
    spectator.component.isSearchOpen.set(true);
    document.body.click();
    expect(spectator.component.isSearchOpen()).toBe(false);
  });
});
