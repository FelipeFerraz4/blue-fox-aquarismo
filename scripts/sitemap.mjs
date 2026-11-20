// Gera public/sitemap.xml: cada página entra uma vez por idioma, com os <xhtml:link hreflang>
// de todas as versões e o x-default (pt-BR). Uso: `npm run sitemap` depois de editar PAGES.
//
// PAGES = páginas públicas pré-renderizadas (nunca /admin, /account nem rascunhos).
// LOCALES espelha SUPPORTED_LOCALES de src/app/core/i18n/locales.ts (o padrão fica na raiz).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://bluefoxaquarismo.space';

const LOCALES = [
  { code: 'pt-BR', prefix: '' },
  { code: 'en', prefix: '/en' },
];

const PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/terms-of-use', changefreq: 'weekly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'weekly', priority: '0.6' },
  { path: '/app/daily-habits/privacy-policy', changefreq: 'weekly', priority: '0.6' },
  { path: '/app/daily-habits/terms-of-use', changefreq: 'weekly', priority: '0.6' },
  { path: '/about', changefreq: 'weekly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.4' },
  { path: '/articles/aquarium-selection-guide', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/aquarium-size', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/aquarium-glass-bowing-danger', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/betta-fish-7-care-tips', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/how-to-choose-aquarium-filter', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/aquarium-filtration-guide', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/aquarium-tpa-guide', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/tetra-fish-guide', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/community-aquarium-guide', changefreq: 'weekly', priority: '0.8' },
  { path: '/articles/aquatic-plants-guide', changefreq: 'weekly', priority: '0.8' },
];

/** URL absoluta da página no idioma: ('/', '/en') → .../en; ('/', '') → .../ */
const url = (path, prefix) => `${ORIGIN}${prefix && path === '/' ? prefix : `${prefix}${path}`}`;

export function buildSitemap() {
  const entries = PAGES.flatMap((page) =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${url(page.path, l.prefix)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.path, '')}" />`,
      ];
      return [
        '  <url>',
        `    <loc>${url(page.path, locale.prefix)}</loc>`,
        ...alternates,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
        '  </url>',
      ].join('\n');
    }),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.join('\n\n'),
    '</urlset>',
    '',
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = new URL('../public/sitemap.xml', import.meta.url);
  writeFileSync(target, buildSitemap());
  console.log(`sitemap: ${PAGES.length} páginas × ${LOCALES.length} idiomas → public/sitemap.xml`);
}
