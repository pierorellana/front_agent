import { CareEstimate, CopayBreakdown } from '../../domain/entities/care-estimate.entity';

export function buildCopayBreakdown(estimate: CareEstimate): CopayBreakdown {
  const recommended = estimate.comparisons.find(
    (hospital) => hospital.hospitalId === estimate.recommendation.hospitalId,
  ) ?? estimate.comparisons[0];

  const hospitalTariff = recommended?.estimatedTotalPrice ?? estimate.recommendation.estimatedPatientPayment;
  const patientPayment = estimate.recommendation.estimatedPatientPayment;
  const coveredAmount = Math.max(hospitalTariff - patientPayment, 0);
  const coveragePercent = hospitalTariff > 0 ? Math.round((coveredAmount / hospitalTariff) * 100) : 0;

  return {
    hospitalTariff,
    coveredAmount,
    patientPayment,
    coveragePercent,
    currency: estimate.recommendation.currency ?? recommended?.currency ?? null,
  };
}
