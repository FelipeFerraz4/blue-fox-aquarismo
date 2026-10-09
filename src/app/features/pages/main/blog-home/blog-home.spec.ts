import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogHome } from './blog-home';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { of } from 'rxjs';

describe('BlogHome', () => {
  let spectator: Spectator<BlogHome>;

  const createComponent = createComponentFactory({
    component: BlogHome,
    imports: [
      RouterTestingModule
    ],
    providers: [
      {
        provide: SeoService,
        useValue: { updateMetadata: jest.fn() }
      },
      {
        provide: PostService,
        useValue: {
          getMostRelevancePost: jest.fn().mockReturnValue(of([])),
          getLatestPosts: jest.fn().mockReturnValue(of([])),
          getLastPost: jest.fn().mockReturnValue(of(null))
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
