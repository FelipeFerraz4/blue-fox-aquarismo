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

  it('skip link focuses main without navigating', () => {
    const link = spectator.query<HTMLAnchorElement>('.skip-link')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    Element.prototype.scrollIntoView = jest.fn();
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('conteudo');
  });
});
