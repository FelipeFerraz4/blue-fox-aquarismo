import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service';

/**
 * Libera a rota para quem tem um dos papéis em `route.data.roles` (constantes de `KeycloakRole`).
 * Sem login, abre o login do Keycloak; logado sem papel, volta para a home.
 * No servidor nega sempre: as rotas protegidas são `RenderMode.Client` (app.routes.server.ts).
 */
export const roleGuard: CanActivateFn = (route) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return false;
  const auth = inject(AuthService);
  const roles = (route.data?.['roles'] as string[] | undefined) ?? [];
  if (!auth.isLoggedIn()) {
    auth.login();
    return false;
  }
  return auth.hasAnyRole(roles) ? true : inject(Router).createUrlTree(['/']);
};
