import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { About } from './about';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { of } from 'rxjs';

describe('About', () => {
  let spectator: Spectator<About>;

  const createComponent = createComponentFactory({
    component: About,
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
