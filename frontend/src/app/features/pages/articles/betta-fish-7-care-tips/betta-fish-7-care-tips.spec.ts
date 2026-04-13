import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { PostService } from '../../../../core/services/post/post';
import { BettaFish7CareTips } from './betta-fish-7-care-tips';


describe('BettaFish7CareTips', () => {
  let spectator: Spectator<BettaFish7CareTips>;

  const createComponent = createComponentFactory({
    component: BettaFish7CareTips,
    providers: [
      {
        provide: SeoService,
        useValue: { updateMetadata: jest.fn() }
      },
      {
        provide: PostService,
        useValue: {
          getPostPageData: jest.fn().mockReturnValue({
            post: {
              title: 'Test',
              description: 'Desc',
              image: 'img.png',
              slug: 'test'
            },
            recommended: [],
            latest: []
          })
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