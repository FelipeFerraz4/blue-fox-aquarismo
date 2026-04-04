import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogHome } from './blog-home';

describe('BlogHome', () => {
  let spectator: Spectator<BlogHome>;

  const createComponent = createComponentFactory({
    component: BlogHome,
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
