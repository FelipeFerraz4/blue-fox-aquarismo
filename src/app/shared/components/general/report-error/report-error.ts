import { TranslatePipe } from '@ngx-translate/core';
import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, PLATFORM_ID, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ReportService } from '../../../../core/services/report/report-service';
import { ReportTargetType } from '../../../model/types/report';

type SendState = 'idle' | 'sending' | 'sent' | 'error' | 'limited';

let nextId = 0;

/**
 * "Encontrou um erro? Avise." — relato privado de erro no conteúdo (artigo, espécie, bioma...).
 * - `mode="button"` (padrão): chamada no fim da página + diálogo nativo (`<dialog>.showModal()`:
 *   prende o foco, fecha com Esc e devolve o foco ao botão).
 * - `mode="inline"`: o formulário direto na página (ex.: página de contato).
 * Sem `targetSlug`, usa o último trecho da URL (ex.: /articles/tetra-fish-guide → tetra-fish-guide).
 * Alternativa por e-mail: endereço com botão copiar e link `mailto:` preenchido.
 */
@Component({
  selector: 'app-report-error',
  imports: [TranslatePipe, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './report-error.html',
  styleUrl: './report-error.scss',
})
export class ReportError {
  readonly targetType = input<ReportTargetType>('POST');
  readonly targetSlug = input<string>('');
  readonly targetTitle = input<string>('');
  readonly mode = input<'button' | 'inline'>('button');

  private readonly reports = inject(ReportService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  /** Ids únicos (pode haver mais de um componente na página). */
  readonly uid = `report-${++nextId}`;
  readonly state = signal<SendState>('idle');
  readonly copied = signal(false);
  readonly contactEmail = this.reports.contactEmail;

  readonly form = inject(FormBuilder).nonNullable.group({
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    suggestion: ['', Validators.maxLength(2000)],
    source: ['', Validators.maxLength(500)],
    email: ['', [Validators.email, Validators.maxLength(255)]],
    website: [''],
  });

  private readonly slug = computed(() => this.targetSlug() || this.slugFromUrl());

  get mailto(): string {
    return this.reports.mailtoLink({ title: this.targetTitle(), url: this.pageUrl(), message: this.form.controls.message.value });
  }

  open(): void {
    this.state.set('idle');
    this.dialog()?.nativeElement.showModal();
  }

  close(): void {
    this.dialog()?.nativeElement.close();
  }

  showError(name: 'message' | 'email'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.document.getElementById(`${this.uid}-${this.form.controls.message.invalid ? 'message' : 'email'}`)?.focus();
      return;
    }
    const v = this.form.getRawValue();
    this.state.set('sending');
    this.reports
      .send({
        targetType: this.targetType(),
        targetSlug: this.slug(),
        targetTitle: this.targetTitle() || undefined,
        pageUrl: this.pageUrl(),
        message: v.message,
        suggestion: v.suggestion || undefined,
        source: v.source || undefined,
        email: v.email || undefined,
        website: v.website || undefined,
      })
      .subscribe({
        next: () => {
          this.state.set('sent');
          this.form.reset();
        },
        error: (err: { status?: number }) => this.state.set(err?.status === 429 ? 'limited' : 'error'),
      });
  }

  async copyEmail(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      await navigator.clipboard.writeText(this.contactEmail);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      this.copied.set(false);
    }
  }

  private pageUrl(): string | undefined {
    return this.isBrowser ? this.document.location.href : undefined;
  }

  private slugFromUrl(): string {
    const path = this.router.url.split(/[?#]/)[0];
    return path.split('/').filter(Boolean).pop() || 'home';
  }
}
