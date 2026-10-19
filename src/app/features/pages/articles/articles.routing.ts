import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';

/**
 * Apenas artigos PUBLICADOS devem ter rota aqui. Cada rota é pré-renderizada no build e entra no sitemap;
 * um artigo ainda sem texto viraria uma página vazia com status 200 (e seria indexada).
 *
 * Para publicar um artigo (os componentes dos rascunhos já existem em ./<slug>/):
 *  1. escreva o texto no <article class="content"> do componente (e o SCSS, se precisar);
 *  2. registre a rota abaixo;
 *  3. adicione a URL em public/sitemap.xml;
 *  4. publique o post no backend: PUT /api/v1/posts/:id com {"published": true} (papel de editor/admin).
 *
 * Prévia local: os rascunhos abaixo (draftRoutes) só são registrados em modo de desenvolvimento (`ng serve`);
 * no build de produção eles não existem, não são pré-renderizados e respondem 404. O cabeçalho (título e imagem)
 * vem da API: com o post ainda como rascunho, ele só aparece se o seu backend local tiver o post publicado.
 *
 * Rascunhos pendentes: nenhum no momento.
 */

const publishedRoutes: Routes = [
  {
    path: 'aquarium-selection-guide',
    loadComponent: () =>
      import('./aquarium-selection-guide/aquarium-selection-guide').then(
        (m) => m.AquariumSelectionGuide,
      ),
  },
  {
    path: 'aquarium-size',
    loadComponent: () => import('./aquarium-size/aquarium-size').then((m) => m.AquariumSize),
  },
  {
    path: 'aquarium-glass-bowing-danger',
    loadComponent: () => import('./aquarium-glass-bowing-danger/aquarium-glass-bowing-danger').then((m) => m.AquariumGlassBowingDanger),
  },
  {
    path: 'betta-fish-7-care-tips',
    loadComponent: () => import('./betta-fish-7-care-tips/betta-fish-7-care-tips').then((m) => m.BettaFish7CareTips),
  },
  {
    path: 'how-to-choose-aquarium-filter',
    loadComponent: () => import('./how-to-choose-aquarium-filter/how-to-choose-aquarium-filter').then((m) => m.HowToChooseAquariumFilter),
  },
  {
    path: 'aquarium-filtration-guide',
    loadComponent: () => import('./aquarium-filtration-guide/aquarium-filtration-guide').then((m) => m.AquariumFiltrationGuide),
  },
  {
    path: 'aquarium-tpa-guide',
    loadComponent: () => import('./aquarium-tpa-guide/aquarium-tpa-guide').then((m) => m.AquariumTpaGuide),
  },
  {
    path: 'tetra-fish-guide',
    loadComponent: () => import('./tetra-fish-guide/tetra-fish-guide').then((m) => m.TetraFishGuide),
  },
  {
    path: 'community-aquarium-guide',
    loadComponent: () => import('./community-aquarium-guide/community-aquarium-guide').then((m) => m.CommunityAquariumGuide),
  },
  {
    path: 'aquatic-plants-guide',
    loadComponent: () => import('./aquatic-plants-guide/aquatic-plants-guide').then((m) => m.AquaticPlantsGuide),
  },
];

/** Artigos em redação (sem rota em produção). Ao começar um novo rascunho, registre-o aqui. */
const draftRoutes: Routes = [];

export const articlesRoutes: Routes = [...publishedRoutes, ...(isDevMode() ? draftRoutes : [])];
