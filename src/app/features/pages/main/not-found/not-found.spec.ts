import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Meta, Title } from '@angular/platform-browser';
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

  it('sets a noindex title and removes robots on destroy', () => {
    const meta = spectator.inject(Meta);
    expect(spectator.inject(Title).getTitle()).toContain('Página não encontrada');
    expect(meta.getTag('name="robots"')?.content).toBe('noindex');
    spectator.fixture.destroy();
    expect(meta.getTag('name="robots"')).toBeNull();
  });
});
