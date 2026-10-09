import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { AquariumSelectionGuide } from './aquarium-selection-guide';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('AquariumSelectionGuide', () => {
  let spectator: Spectator<AquariumSelectionGuide>;

  const createComponent = createComponentFactory({
    component: AquariumSelectionGuide,
    providers: [
      provideRouter([]),
      {
        provide: SeoService,
        useValue: { updateMetadata: jest.fn() }
      },
      {
        provide: PostService,
        useValue: {
          getPostBySlug: jest.fn().mockReturnValue(of({
            title: 'Test',
            description: 'Desc',
            imageUrl: 'img.png',
            slug: 'test',
            views: 0
          })),
          getRecommendedPosts: jest.fn().mockReturnValue(of([])),
          getNextPost: jest.fn().mockReturnValue(of([])),
          incrementViews: jest.fn().mockReturnValue(of(undefined))
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
