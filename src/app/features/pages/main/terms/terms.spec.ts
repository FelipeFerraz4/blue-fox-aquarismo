import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Terms } from './terms';
import { SeoService } from '../../../../core/services/seo/seo-service';

describe('Terms', () => {
  let spectator: Spectator<Terms>;

  const createComponent = createComponentFactory({
    component: Terms,
    imports: [
      RouterTestingModule
    ],
    providers: [
      {
        provide: SeoService,
        useValue: { updateMetadata: jest.fn() }
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
