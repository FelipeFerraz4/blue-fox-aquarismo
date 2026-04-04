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
];
