import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { LanguageService } from '../i18n/language-service';

/**
 * Leituras (GET) da blog-api vão com `?lang=<idioma da página>`: posts e catálogo voltam traduzidos
 * (com fallback para pt-BR na API). Como o idioma vem da URL, o pré-render de /en/... já busca em inglês.
 * Não mexe em quem já mandou `lang` nem em escritas.
 */
export const langInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.url.startsWith(environment.blogApi.urlBase) || req.params.has('lang')) {
    return next(req);
  }
  const lang = inject(LanguageService).current();
  return next(req.clone({ params: req.params.set('lang', lang) }));
};
