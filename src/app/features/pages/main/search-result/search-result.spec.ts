import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SearchResult } from './search-result';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';

describe('SearchResult', () => {
  let spectator: Spectator<SearchResult>;

  const createComponent = createComponentFactory({
    component: SearchResult,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: SeoService,
        useValue: { updateMetadata: jest.fn() },
      },
      {
        provide: PostService,
        useValue: {
          searchPosts: jest.fn().mockReturnValue(of([])),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the search result component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should execute search and populate posts', () => {
    const postService = spectator.inject(PostService);
    const mockPosts = [
      {
        id: '1',
        title: 'Betta Fish Care',
        description: 'Complete guide',
        slug: 'betta-fish',
        readingTime: '5 min',
      } as unknown as Post,
    ];
    jest.spyOn(postService, 'searchPosts').mockReturnValue(of(mockPosts));

    spectator.component.executeSearch('betta');

    expect(spectator.component.posts()).toEqual(mockPosts);
    expect(spectator.component.isLoading()).toBe(false);
    expect(spectator.component.hasSearched()).toBe(true);
  });
});
