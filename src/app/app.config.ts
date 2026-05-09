import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/config/api.config';
import { CARE_ESTIMATE_REPOSITORY } from './core/domain/repositories/care-estimate.repository';
import { CareEstimateHttpRepository } from './infrastructure/http/repositories/care-estimate-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_BASE_URL, useValue: 'https://back-agente-txmo.onrender.com/api' },
    { provide: CARE_ESTIMATE_REPOSITORY, useClass: CareEstimateHttpRepository },
  ]
};
