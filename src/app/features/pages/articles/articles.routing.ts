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
 * Rascunhos pendentes: aquarium-filtration-guide, aquarium-tpa-guide, tetra-fish-guide,
 * community-aquarium-guide e aquatic-plants-guide (este ainda nem existe no backend).
 */

export const articlesRoutes: Routes = [
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
];
