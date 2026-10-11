import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'app/daily-habits/privacy-policy',
    loadComponent: () =>
      import('./daily-habits/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
  },
  {
    path: 'app/daily-habits/terms-of-use',
    loadComponent: () =>
      import('./daily-habits/terms-of-use/terms-of-use').then((m) => m.TermsOfUse),
  },
];
