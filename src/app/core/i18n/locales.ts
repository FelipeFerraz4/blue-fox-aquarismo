/**
 * Idiomas ativos do site — fonte única no front (o backend tem a sua em
 * blue-fox-blog-backend/src/modules/aquarismo/common/locale.ts). Para adicionar um idioma, siga a
 * skill `bluefox-add-language`: arquivo em src/assets/i18n/<code>.json, entrada aqui e no loader.
 * O primeiro é o padrão (SSR, pré-render e fallback de chaves faltando).
 */
export const SUPPORTED_LOCALES = [
  { code: 'pt-BR', label: 'Português', short: 'PT', dateLocale: 'pt-BR' },
  { code: 'en', label: 'English', short: 'EN', dateLocale: 'en-US' },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]['code'];

export const DEFAULT_LOCALE: SupportedLocale = SUPPORTED_LOCALES[0].code;

/** Chave do localStorage com a escolha do visitante (ausente = padrão). */
export const LOCALE_STORAGE_KEY = 'bf-lang';

export function isSupportedLocale(code: unknown): code is SupportedLocale {
  return SUPPORTED_LOCALES.some((l) => l.code === code);
}

export function localeInfo(code: SupportedLocale) {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
}
