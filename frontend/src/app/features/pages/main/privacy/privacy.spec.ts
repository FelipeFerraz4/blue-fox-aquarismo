import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Privacy } from './privacy';

describe('Privacy', () => {
  let spectator: Spectator<Privacy>;

  const createComponent = createComponentFactory({
    component: Privacy,
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
