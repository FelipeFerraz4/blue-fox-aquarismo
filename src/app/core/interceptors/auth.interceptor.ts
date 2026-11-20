import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

import { AuthService } from '../services/auth/auth-service';

/**
 * Marca uma requisição que deve levar o token do Keycloak (ex.: chamadas do painel /admin).
 * Só as marcadas recebem o token: as páginas públicas continuam anônimas mesmo com um editor
 * logado, para não mostrar rascunhos no site nem divergir do HTML pré-renderizado.
 *
 *   this.http.get(url, { context: withAuth() })
 */
export const WITH_AUTH = new HttpContextToken<boolean>(() => false);

export const withAuth = (): HttpContext => new HttpContext().set(WITH_AUTH, true);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(WITH_AUTH)) return next(req);
  const auth = inject(AuthService);
  return from(auth.getFreshToken()).pipe(
    switchMap((token) => next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req)),
  );
};
