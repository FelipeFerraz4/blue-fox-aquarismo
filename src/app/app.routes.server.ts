import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Rotas conhecidas são pré-renderizadas no build. O `**` do router (NotFound) não pode ser
 * pré-renderizado; sem a última entrada, uma URL desconhecida caía no Express ("Cannot GET").
 * Ela renderiza a NotFound no servidor e responde 404.
 * Ao criar uma rota de topo nova, inclua-a em `pages` (vale para pt e en; senão ela responde 404 no SSR).
 */
/** Rotas de página (sem o prefixo de idioma); cada uma vale para "/x" e "/en/x". */
const pages: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'search', renderMode: RenderMode.Prerender },
  { path: 'terms-of-use', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  // Painel e conta: só no navegador (exigem login), fora do prerender e do sitemap.
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'account', renderMode: RenderMode.Client },
  { path: 'app/**', renderMode: RenderMode.Prerender },
  { path: 'articles', renderMode: RenderMode.Prerender },
  { path: 'articles/**', renderMode: RenderMode.Prerender },
];

/** Prefixa a rota com o idioma (en/...). */
const withPrefix = (prefix: string) => (r: ServerRoute): ServerRoute => ({ ...r, path: r.path ? `${prefix}/${r.path}` : prefix });

export const serverRoutes: ServerRoute[] = [
  ...pages,
  ...pages.map(withPrefix('en')),
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
