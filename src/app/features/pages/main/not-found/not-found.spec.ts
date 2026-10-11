import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let spectator: Spectator<NotFound>;

  const createComponent = createComponentFactory({
    component: NotFound,
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
