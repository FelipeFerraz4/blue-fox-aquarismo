import { Routes } from '@angular/router';

import { CONTENT_MANAGER_ROLES } from '../../core/auth/roles.constants';
import { roleGuard } from '../../core/guards/role.guard';

/**
 * Painel /admin: só para quem gerencia conteúdo (editor/admin do Aquarismo).
 * Renderizado só no navegador (RenderMode.Client), fora do sitemap e com noindex.
 */
export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: CONTENT_MANAGER_ROLES },
    loadComponent: () => import('./layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', loadComponent: () => import('./dashboard/admin-dashboard').then((m) => m.AdminDashboard) },
      { path: 'reports', loadComponent: () => import('./reports/admin-reports').then((m) => m.AdminReports) },
      { path: 'catalog', loadComponent: () => import('./catalog/admin-catalog').then((m) => m.AdminCatalog) },
      {
        path: 'catalog/species/:slug',
        loadComponent: () => import('./species-edit/admin-species-edit').then((m) => m.AdminSpeciesEdit),
      },
      { path: 'posts', loadComponent: () => import('./posts/admin-posts').then((m) => m.AdminPosts) },
    ],
  },
];
