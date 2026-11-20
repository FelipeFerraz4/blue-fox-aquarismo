import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';

import { ReportService } from '../../../../core/services/report/report-service';
import { ReportError } from './report-error';

describe('ReportError', () => {
  let spectator: Spectator<ReportError>;
  const send = jest.fn();

  const createComponent = createComponentFactory({
    component: ReportError,
    providers: [
      { provide: PLATFORM_ID, useValue: 'browser' },
      mockProvider(ReportService, { send, mailtoLink: () => 'mailto:x@y.z', contactEmail: 'x@y.z' }),
      mockProvider(Router, { url: '/articles/tetra-fish-guide?ref=home' }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    send.mockReset().mockReturnValue(of({ received: true }));
    // jsdom não implementa showModal/close
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  it('opens the native dialog from the call to action', () => {
    spectator = createComponent({ props: { targetTitle: 'Tetras' } });
    spectator.detectChanges();
    spectator.click('.report-cta button');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('does not send an invalid form and shows the error tied to the field', () => {
    spectator = createComponent({ props: { mode: 'inline' } });
    spectator.detectChanges();
    spectator.typeInElement('curto', 'textarea[formControlName="message"]');
    spectator.click('button[type="submit"]');
    expect(send).not.toHaveBeenCalled();
    const field = spectator.query<HTMLTextAreaElement>('textarea[formControlName="message"]')!;
    expect(field.getAttribute('aria-invalid')).toBe('true');
    const errorId = field.getAttribute('aria-describedby')!.split(' ').find((id) => id.endsWith('-error'))!;
    expect(spectator.query(`#${errorId}`)?.textContent).toContain('10 caracteres');
  });

  it('sends the report with the slug taken from the URL and thanks the reader', () => {
    spectator = createComponent({ props: { mode: 'inline', targetTitle: 'Tetras' } });
    spectator.detectChanges();
    spectator.typeInElement('A temperatura máxima está errada.', 'textarea[formControlName="message"]');
    spectator.typeInElement('leitor@exemplo.com', 'input[formControlName="email"]');
    spectator.click('button[type="submit"]');
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: 'POST',
        targetSlug: 'tetra-fish-guide',
        targetTitle: 'Tetras',
        message: 'A temperatura máxima está errada.',
        email: 'leitor@exemplo.com',
      }),
    );
    expect(send.mock.calls[0][0].website).toBeUndefined();
    expect(spectator.query('[role="status"]')?.textContent).toContain('Obrigado');
  });

  it('explains the rate limit when the API answers 429', () => {
    send.mockReturnValue(throwError(() => ({ status: 429 })));
    spectator = createComponent({ props: { mode: 'inline' } });
    spectator.detectChanges();
    spectator.typeInElement('Mensagem longa o bastante.', 'textarea[formControlName="message"]');
    spectator.click('button[type="submit"]');
    expect(spectator.query('.status')?.textContent).toContain('Muitos avisos');
  });

  it('offers the e-mail with a mailto link', () => {
    spectator = createComponent({ props: { mode: 'inline' } });
    spectator.detectChanges();
    expect(spectator.query('.report-email')?.textContent).toContain('x@y.z');
    expect(spectator.query('.report-email a')?.getAttribute('href')).toBe('mailto:x@y.z');
  });
});
