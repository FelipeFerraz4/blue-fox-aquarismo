import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PLATFORM_ID } from '@angular/core';

import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let spectator: Spectator<App>;

  const createComponent = createComponentFactory({
    component: App,
    providers: [
      { provide: PLATFORM_ID, useValue: 'browser' },
      provideRouter([])
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });
});