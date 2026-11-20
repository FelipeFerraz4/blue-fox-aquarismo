/**
 * Idiomas ativos do site — fonte única no front (o backend tem a sua em
 * blue-fox-blog-backend/src/common/i18n/locale.ts). Para adicionar um idioma, siga a skill
 * `bluefox-add-language`: arquivo em src/assets/i18n/<code>.json, entrada aqui e no loader.
 * O primeiro é o padrão: fica na raiz da URL e é o fallback de chaves faltando. Os demais ficam
 * sob o próprio prefixo (`urlPrefix`, ex.: /en/about).
 */
export const SUPPORTED_LOCALES = [
  { code: 'pt-BR', label: 'Português', short: 'PT', dateLocale: 'pt-BR', urlPrefix: '', ogLocale: 'pt_BR' },
  { code: 'en', label: 'English', short: 'EN', dateLocale: 'en-US', urlPrefix: 'en', ogLocale: 'en_US' },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]['code'];

export const DEFAULT_LOCALE: SupportedLocale = SUPPORTED_LOCALES[0].code;

/** Chave do localStorage com o idioma preferido (ausente = padrão); usada só ao entrar pela home. */
export const LOCALE_STORAGE_KEY = 'bf-lang';

export function isSupportedLocale(code: unknown): code is SupportedLocale {
  return SUPPORTED_LOCALES.some((l) => l.code === code);
}

export function localeInfo(code: SupportedLocale) {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
}
