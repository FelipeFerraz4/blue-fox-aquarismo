import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RouterTestingModule } from '@angular/router/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../../../core/services/auth/auth-service';

// 🔥 MOCK DO KEYCLOAK (ANTES DE TUDO)
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

describe('Navbar', () => {
  let spectator: Spectator<Navbar>;

  const mockAuthService = {
    isLoggedIn: jest.fn().mockReturnValue(false),
    getUsername: jest.fn().mockReturnValue('test-user'),
    login: jest.fn(),
    logout: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: Navbar,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: AuthService,
        useValue: mockAuthService,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should start with menu closed', () => {
    expect(spectator.component.menuOpen).toBe(false);
  });

  it('should toggle menuOpen when toggleMenu is called', () => {
    spectator.component.toggleMenu();
    expect(spectator.component.menuOpen).toBe(true);

    spectator.component.toggleMenu();
    expect(spectator.component.menuOpen).toBe(false);
  });

  it('should close accordions when menu is toggled to false', () => {
    spectator.component.artigosOpen = true;
    spectator.component.ferramentasOpen = true;
    spectator.component.menuOpen = true;

    spectator.component.toggleMenu();

    expect(spectator.component.artigosOpen).toBe(false);
    expect(spectator.component.ferramentasOpen).toBe(false);
  });

  it('should toggle artigosOpen and close ferramentasOpen', () => {
    spectator.component.toggleArtigos();

    expect(spectator.component.artigosOpen).toBe(true);
    expect(spectator.component.ferramentasOpen).toBe(false);

    spectator.component.toggleArtigos();

    expect(spectator.component.artigosOpen).toBe(false);
  });

  it('should toggle ferramentasOpen and close artigosOpen', () => {
    spectator.component.artigosOpen = true;

    spectator.component.toggleFerramentas();

    expect(spectator.component.ferramentasOpen).toBe(true);
    expect(spectator.component.artigosOpen).toBe(false);

    spectator.component.toggleFerramentas();

    expect(spectator.component.ferramentasOpen).toBe(false);
  });

  it('should render navigation links', () => {
    spectator.component.menuOpen = true;
    spectator.component.ferramentasOpen = true;
    spectator.detectChanges();

    expect(spectator.query('a[routerLink="/"]')).toBeTruthy();
    expect(spectator.query('a[routerLink="/about"]')).toBeTruthy();
  });

  it('should toggle menu when button is clicked', () => {
    const button = spectator.query('button.menu-toggle') as HTMLButtonElement;

    button.click();

    expect(spectator.component.menuOpen).toBe(true);
  });

  it('should call login', () => {
    spectator.component.login();

    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should call logout', () => {
    spectator.component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});