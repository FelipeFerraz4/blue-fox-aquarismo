import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Privacy } from './privacy';
import { SeoService } from '../../../../core/services/seo/seo-service';

describe('Privacy', () => {
  let spectator: Spectator<Privacy>;

  const createComponent = createComponentFactory({
    component: Privacy,
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
