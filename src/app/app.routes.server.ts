import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Rotas conhecidas são pré-renderizadas no build. O `**` do router (NotFound) não pode ser
 * pré-renderizado; sem a última entrada, uma URL desconhecida caía no Express ("Cannot GET").
 * Ela renderiza a NotFound no servidor e responde 404.
 * Ao criar uma rota de topo nova, inclua-a aqui (senão ela responde 404 no SSR).
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'search', renderMode: RenderMode.Prerender },
  { path: 'terms-of-use', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'app/**', renderMode: RenderMode.Prerender },
  { path: 'articles', renderMode: RenderMode.Prerender },
  { path: 'articles/**', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
