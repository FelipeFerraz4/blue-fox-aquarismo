import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { KeycloakRole } from '../auth/roles.constants';
import { AuthService } from '../services/auth/auth-service';
import { roleGuard } from './role.guard';

// keycloak-js é ESM; o AuthService real nem é usado aqui (vai mockado), mas o import precisa resolver.
jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }));


describe('roleGuard', () => {
  const auth = { isLoggedIn: jest.fn(), hasAnyRole: jest.fn(), login: jest.fn() };
  const route = { data: { roles: [KeycloakRole.AQUARIUM_EDITOR] } } as unknown as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  const run = (platform: string, r: ActivatedRouteSnapshot = route) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platform },
        { provide: AuthService, useValue: auth },
      ],
    });
    return TestBed.runInInjectionContext(() => roleGuard(r, state));
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    jest.resetAllMocks();
  });

  it('denies on the server', () => {
    expect(run('server')).toBe(false);
  });

  it('opens the login when there is no session', () => {
    auth.isLoggedIn.mockReturnValue(false);
    expect(run('browser')).toBe(false);
    expect(auth.login).toHaveBeenCalled();
  });

  it('sends logged users without the role to the home page', () => {
    auth.isLoggedIn.mockReturnValue(true);
    auth.hasAnyRole.mockReturnValue(false);
    const result = run('browser');
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/');
  });

  it('lets content managers in', () => {
    auth.isLoggedIn.mockReturnValue(true);
    auth.hasAnyRole.mockReturnValue(true);
    expect(run('browser')).toBe(true);
    expect(auth.hasAnyRole).toHaveBeenCalledWith([KeycloakRole.AQUARIUM_EDITOR]);
  });

  it('only requires a session when the route has no roles (e.g. /account)', () => {
    const open = { data: {} } as unknown as ActivatedRouteSnapshot;
    auth.isLoggedIn.mockReturnValue(true);
    auth.hasAnyRole.mockReturnValue(false);
    expect(run('browser', open)).toBe(true);

    TestBed.resetTestingModule();
    auth.isLoggedIn.mockReturnValue(false);
    expect(run('browser', open)).toBe(false);
    expect(auth.login).toHaveBeenCalled();
  });
});
