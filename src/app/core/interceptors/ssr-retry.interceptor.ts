import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { retry, throwError, timer } from 'rxjs';

/** Tentativas extras após a primeira falha. */
export const SSR_RETRY_COUNT = 3;
/** Espera antes da tentativa N: N × este valor (1 s, 2 s, 3 s). */
export const SSR_RETRY_DELAY_MS = 1000;

/**
 * Falhas passageiras que valem nova tentativa: rede (0), rate limit (429), erro do servidor (5xx)
 * e o caso do nginx da blog-api, que transforma o 503 do rate limit num redirect para uma página HTML:
 * a requisição termina com status 200, mas o corpo não é JSON e o HttpClient acusa erro de parse.
 * 404 e os demais 4xx são respostas reais (ex.: post em rascunho) e não são repetidos.
 */
function isTransient(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;
  return error.status === 0 || error.status === 429 || error.status >= 500 || error.status === 200;
}

/**
 * Só no servidor (pré-renderização no build e SSR): uma falha passageira da API faria o artigo
 * ser gerado sem cabeçalho, e esse HTML fica no ar até o próximo build. No navegador não repete,
 * para não atrasar a interface.
 */
export const ssrRetryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !isPlatformServer(inject(PLATFORM_ID))) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: SSR_RETRY_COUNT,
      delay: (error, attempt) =>
        isTransient(error) ? timer(attempt * SSR_RETRY_DELAY_MS) : throwError(() => error),
    }),
  );
};
