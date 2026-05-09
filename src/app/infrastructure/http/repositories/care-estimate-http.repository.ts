import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { CareEstimate, EstimateCareCommand } from '../../../core/domain/entities/care-estimate.entity';
import { CareEstimateRepository } from '../../../core/domain/repositories/care-estimate.repository';
import { buildDemoCareEstimate } from '../../mocks/demo-care-estimate.factory';
import {
  CareEstimateResponseDto,
  GeneralResponseDto,
} from '../dtos/care-estimate-api.dto';
import { toCareEstimate, toCareEstimateRequestDto } from '../mappers/care-estimate.mapper';

@Injectable()
export class CareEstimateHttpRepository implements CareEstimateRepository {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  estimateCare(command: EstimateCareCommand): Observable<CareEstimate> {
    return this.http
      .post<GeneralResponseDto<CareEstimateResponseDto>>(
        `${this.apiBaseUrl}/care-estimates`,
        toCareEstimateRequestDto(command),
      )
      .pipe(
        map((response) => toCareEstimate(response)),
        catchError(() => of(buildDemoCareEstimate(command))),
      );
  }
}
