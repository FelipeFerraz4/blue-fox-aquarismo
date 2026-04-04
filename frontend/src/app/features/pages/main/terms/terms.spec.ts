import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Terms } from './terms';

describe('Terms', () => {
  let spectator: Spectator<Terms>;

  const createComponent = createComponentFactory({
    component: Terms,
    imports: [
      RouterTestingModule
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
