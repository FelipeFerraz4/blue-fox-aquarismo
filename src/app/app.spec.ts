import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { App } from './app';

jest.mock('keycloak-js', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn(),
      logout: jest.fn(),
      updateToken: jest.fn().mockResolvedValue(true),
      token: 'fake-token',
      authenticated: true,
      tokenParsed: {
        preferred_username: 'test-user',
      },
    })),
  };
});

describe('App', () => {
  let spectator: Spectator<App>;

  const createComponent = createComponentFactory({
    component: App,
    providers: [
      { provide: PLATFORM_ID, useValue: 'browser' },
      provideRouter([]),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });
});