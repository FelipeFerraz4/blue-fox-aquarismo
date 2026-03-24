import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/pages/main/blog-home/blog-home').then((m) => m.BlogHome),
      },
      {
        path: '',
        loadChildren: () => import('./features/apps/app.routing').then((m) => m.appRoutes),
      },
    ],
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import('./features/pages/main/terms/terms').then((m) => m.Terms),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./features/pages/main/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/pages/main/about/about').then((m) => m.About),
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('./features/pages/articles/articles.routing').then((m) => m.articlesRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/pages/main/not-found/not-found').then((m) => m.NotFound),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
