import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ReportInput } from '../../../shared/model/types/report';

/** Envio público de relatos de erro (privados: só editores leem no painel). */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private url = `${environment.blogApi.urlBase}api/v1/reports`;

  send(report: ReportInput): Observable<{ received: true }> {
    return this.http.post<{ received: true }>(this.url, report);
  }

  /** `mailto:` com assunto e corpo preenchidos, alternativa ao formulário. */
  mailtoLink(context: { title?: string; url?: string; message?: string }): string {
    const subject = `Correção: ${context.title || 'Blue Fox Aquarismo'}`;
    const body = [
      context.url ? `Página: ${context.url}` : '',
      '',
      'O que está errado:',
      context.message || '',
      '',
      'Correção sugerida (e fonte, se tiver):',
      '',
    ].join('\n');
    return `mailto:${environment.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  get contactEmail(): string {
    return environment.contactEmail;
  }
}
