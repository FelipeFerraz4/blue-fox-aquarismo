import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let spectator: Spectator<Footer>;

  const createComponent = createComponentFactory({
    component: Footer,
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

  it('should display the current year in the copyright', () => {
    const currentYear = new Date().getFullYear().toString();
    expect(spectator.element).toHaveText(currentYear);
  });

  it('should have correct links', () => {
    expect(spectator.query('a[href="/"]')).toBeTruthy();
    expect(spectator.query('a[href*="about"]')).toBeTruthy();
    expect(spectator.query('a[href*="privacy"]')).toBeTruthy();
    expect(spectator.query('a[href*="terms"]')).toBeTruthy();
  });
});