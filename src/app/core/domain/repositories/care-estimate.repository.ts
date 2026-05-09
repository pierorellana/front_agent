import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CareEstimate, EstimateCareCommand } from '../entities/care-estimate.entity';

export interface CareEstimateRepository {
  estimateCare(command: EstimateCareCommand): Observable<CareEstimate>;
}

export const CARE_ESTIMATE_REPOSITORY = new InjectionToken<CareEstimateRepository>(
  'CARE_ESTIMATE_REPOSITORY',
);
