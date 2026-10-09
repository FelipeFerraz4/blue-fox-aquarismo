import { Routes } from '@angular/router';

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
