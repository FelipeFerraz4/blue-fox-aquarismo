import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Meta } from '@angular/platform-browser';

import { LanguageService } from '../../../../core/i18n/language-service';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { ThemeService } from '../../../../core/services/theme/theme-service';
import { Account } from './account';

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }));

describe('Account', () => {
  let spectator: Spectator<Account>;
  const auth = {
    getUserFullName: jest.fn().mockReturnValue('Ana Souza'),
    getUsername: jest.fn().mockReturnValue('ana'),
    getEmail: jest.fn().mockReturnValue('ana@example.com'),
    hasAnyRole: jest.fn().mockReturnValue(false),
    manageAccount: jest.fn(),
    logout: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: Account,
    providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    spectator = createComponent();
  });

  it('shows the profile from the token and keeps the page out of search engines', () => {
    expect(spectator.query('h1')).toHaveText('Minha conta');
    expect(spectator.query('.profile')).toHaveText('Ana Souza');
    expect(spectator.query('.profile')).toHaveText('ana@example.com');
    expect(spectator.inject(Meta).getTag('name="robots"')?.content).toBe('noindex, nofollow');
    expect(spectator.query('a[href="/admin"]')).toBeNull();
  });

  it('changes the language and the theme', () => {
    const language = spectator.inject(LanguageService);
    const switchTo = jest.spyOn(language, 'switchTo').mockImplementation(() => undefined);
    const setTheme = jest.spyOn(spectator.inject(ThemeService), 'set');

    spectator.click('input[name="language"][value="en"]');
    expect(switchTo).toHaveBeenCalledWith('en');

    spectator.click('input[name="theme"][value="dark"]');
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('opens the SSO account and logs out', () => {
    const buttons = spectator.queryAll<HTMLButtonElement>('.actions button');
    spectator.click(buttons[0]);
    expect(auth.manageAccount).toHaveBeenCalled();
    spectator.click(buttons[buttons.length - 1]);
    expect(auth.logout).toHaveBeenCalled();
  });

  it('links content managers to the admin panel', () => {
    auth.hasAnyRole.mockReturnValue(true);
    spectator = createComponent();
    expect(spectator.query('a[href="/admin"]')).toBeTruthy();
  });
});
