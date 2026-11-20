import { HttpClient, HttpParams, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { environment } from '../../../environments/environment';
import { LanguageService } from '../i18n/language-service';
import { provideTestTranslations } from '../i18n/testing';
import { langInterceptor } from './lang.interceptor';

describe('langInterceptor', () => {
  const api = `${environment.blogApi.urlBase}/posts`;
  let http: HttpClient;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideTestTranslations(),
        provideHttpClient(withInterceptors([langInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('adds the page language to blog-api reads', () => {
    TestBed.inject(LanguageService).current.set('en');
    http.get(api).subscribe();
    expect(ctrl.expectOne((r) => r.url === api).request.params.get('lang')).toBe('en');
  });

  it('keeps an explicit lang, writes and other hosts untouched', () => {
    http.get(api, { params: new HttpParams().set('lang', 'pt-BR') }).subscribe();
    http.post(api, {}).subscribe();
    http.get('https://example.com/x').subscribe();

    expect(ctrl.expectOne((r) => r.method === 'GET' && r.url === api).request.params.get('lang')).toBe('pt-BR');
    expect(ctrl.expectOne((r) => r.method === 'POST').request.params.has('lang')).toBe(false);
    expect(ctrl.expectOne('https://example.com/x').request.params.has('lang')).toBe(false);
  });
});
