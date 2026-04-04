import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { About } from './about';

describe('About', () => {
  let spectator: Spectator<About>;

  const createComponent = createComponentFactory({
    component: About,
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
