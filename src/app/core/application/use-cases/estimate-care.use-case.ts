import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CareEstimate, EstimateCareCommand } from '../../domain/entities/care-estimate.entity';
import { CARE_ESTIMATE_REPOSITORY } from '../../domain/repositories/care-estimate.repository';

@Injectable({ providedIn: 'root' })
export class EstimateCareUseCase {
  private readonly repository = inject(CARE_ESTIMATE_REPOSITORY);

  execute(command: EstimateCareCommand): Observable<CareEstimate> {
    return this.repository.estimateCare({
      documentNumber: command.documentNumber.trim(),
      symptomText: command.symptomText.trim(),
    });
  }
}
