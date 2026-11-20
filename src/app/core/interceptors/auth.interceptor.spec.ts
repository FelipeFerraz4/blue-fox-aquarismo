import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from '../services/auth/auth-service';
import { authInterceptor, withAuth } from './auth.interceptor';

// keycloak-js é ESM; o AuthService real nem é usado aqui (vai mockado), mas o import precisa resolver.
jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }));


describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  const getFreshToken = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getFreshToken } },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    getFreshToken.mockReset();
  });

  afterEach(() => ctrl.verify());

  it('leaves public requests anonymous', () => {
    http.get('/api/v1/posts').subscribe();
    const req = ctrl.expectOne('/api/v1/posts');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(getFreshToken).not.toHaveBeenCalled();
    req.flush([]);
  });

  it('adds the bearer token to requests marked withAuth', async () => {
    getFreshToken.mockResolvedValue('tok');
    http.get('/api/v1/reports', { context: withAuth() }).subscribe();
    await Promise.resolve();
    const req = ctrl.expectOne('/api/v1/reports');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    req.flush([]);
  });

  it('sends without token when there is no session', async () => {
    getFreshToken.mockResolvedValue(undefined);
    http.get('/api/v1/reports', { context: withAuth() }).subscribe();
    await Promise.resolve();
    const req = ctrl.expectOne('/api/v1/reports');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
