import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CONTENT_MANAGER_ROLES } from '../../../../core/auth/roles.constants';
import { LanguageService } from '../../../../core/i18n/language-service';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../../core/i18n/locales';
import { LocalizePipe } from '../../../../core/i18n/localize.pipe';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { SeoService } from '../../../../core/services/seo/seo-service';
import { ThemeService } from '../../../../core/services/theme/theme-service';
import { ThemePreference } from '../../../../shared/model/types/theme';

/**
 * Perfil do usuário logado: dados da conta (vindos do token do Keycloak) e preferências do site
 * (idioma e tema). Nome, e-mail e senha são editados no próprio SSO ("Gerenciar conta").
 * Rota só no navegador (RenderMode.Client), com noindex e fora do sitemap.
 */
@Component({
  selector: 'app-account',
  imports: [LocalizePipe, RouterLink, TranslatePipe],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  protected readonly language = inject(LanguageService);
  protected readonly theme = inject(ThemeService);
  private readonly seo = inject(SeoService);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);

  readonly locales = SUPPORTED_LOCALES;
  readonly themes: ThemePreference[] = ['system', 'light', 'dark'];

  readonly name = computed(() => this.auth.getUserFullName() ?? this.auth.getUsername() ?? '');
  readonly username = this.auth.getUsername();
  readonly email = this.auth.getEmail();
  readonly canManageContent = this.auth.hasAnyRole(CONTENT_MANAGER_ROLES);

  ngOnInit(): void {
    this.seo.updateMetadata({
      title: this.translate.instant('META.ACCOUNT_TITLE'),
      description: this.translate.instant('META.ACCOUNT_DESCRIPTION'),
      url: 'https://bluefoxaquarismo.space/account',
      type: 'website',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  ngOnDestroy(): void {
    this.meta.removeTag('name="robots"');
  }

  setLanguage(lang: SupportedLocale): void {
    this.language.switchTo(lang);
  }

  setTheme(pref: ThemePreference): void {
    this.theme.set(pref);
  }
}
