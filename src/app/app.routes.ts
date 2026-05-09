import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/copay-assistant/pages/copay-assistant-page/copay-assistant-page')
        .then((module) => module.CopayAssistantPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
