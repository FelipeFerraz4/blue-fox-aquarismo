import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SSR_RETRY_COUNT, SSR_RETRY_DELAY_MS, ssrRetryInterceptor } from './ssr-retry.interceptor';

const URL = '/api/v1/posts/slug/x';

function setup(platform: 'server' | 'browser') {
  TestBed.configureTestingModule({
    providers: [
      { provide: PLATFORM_ID, useValue: platform },
      provideHttpClient(withInterceptors([ssrRetryInterceptor])),
      provideHttpClientTesting(),
    ],
  });
  return { http: TestBed.inject(HttpClient), backend: TestBed.inject(HttpTestingController) };
}

describe('ssrRetryInterceptor', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    jest.useRealTimers();
  });

  it('no servidor, repete após 503 e entrega a resposta seguinte', () => {
    const { http, backend } = setup('server');
    let body: unknown;
    http.get(URL).subscribe((b) => (body = b));

    backend.expectOne(URL).flush('busy', { status: 503, statusText: 'Service Unavailable' });
    jest.advanceTimersByTime(SSR_RETRY_DELAY_MS);
    backend.expectOne(URL).flush({ slug: 'x' });

    expect(body).toEqual({ slug: 'x' });
  });

  it('no servidor, repete quando o redirect do nginx devolve HTML no lugar de JSON', () => {
    const { http, backend } = setup('server');
    let body: unknown;
    http.get(URL).subscribe((b) => (body = b));

    backend.expectOne(URL).error(new ProgressEvent('error'), { status: 200, statusText: 'OK' });
    jest.advanceTimersByTime(SSR_RETRY_DELAY_MS);
    backend.expectOne(URL).flush({ slug: 'x' });

    expect(body).toEqual({ slug: 'x' });
  });

  it('desiste depois do limite de tentativas e repassa o erro', () => {
    const { http, backend } = setup('server');
    let status: number | undefined;
    http.get(URL).subscribe({ error: (e) => (status = e.status) });

    for (let attempt = 1; attempt <= SSR_RETRY_COUNT; attempt++) {
      backend.expectOne(URL).flush('busy', { status: 503, statusText: 'Service Unavailable' });
      jest.advanceTimersByTime(attempt * SSR_RETRY_DELAY_MS);
    }
    backend.expectOne(URL).flush('busy', { status: 503, statusText: 'Service Unavailable' });

    expect(status).toBe(503);
  });

  it('não repete 404 (post inexistente ou em rascunho)', () => {
    const { http, backend } = setup('server');
    let status: number | undefined;
    http.get(URL).subscribe({ error: (e) => (status = e.status) });

    backend.expectOne(URL).flush('not found', { status: 404, statusText: 'Not Found' });
    jest.advanceTimersByTime(10 * SSR_RETRY_DELAY_MS);

    expect(status).toBe(404);
  });

  it('no navegador não repete', () => {
    const { http, backend } = setup('browser');
    let status: number | undefined;
    http.get(URL).subscribe({ error: (e) => (status = e.status) });

    backend.expectOne(URL).flush('busy', { status: 503, statusText: 'Service Unavailable' });
    jest.advanceTimersByTime(10 * SSR_RETRY_DELAY_MS);

    expect(status).toBe(503);
  });
});
