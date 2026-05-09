import {
  CareEstimate,
  EstimateCareCommand,
  HospitalComparison,
} from '../../../core/domain/entities/care-estimate.entity';
import {
  CareEstimateRequestDto,
  CareEstimateResponseDto,
  GeneralResponseDto,
  HospitalComparisonResponseDto,
} from '../dtos/care-estimate-api.dto';

export function toCareEstimateRequestDto(command: EstimateCareCommand): CareEstimateRequestDto {
  return {
    document_number: command.documentNumber,
    symptom_text: command.symptomText,
  };
}

export function toCareEstimate(
  response: GeneralResponseDto<CareEstimateResponseDto>,
): CareEstimate {
  if (!response.success || response.data === null) {
    throw new Error(response.error?.message ?? 'No se pudo calcular la cobertura.');
  }

  const data = response.data;

  return {
    patient: {
      userId: data.patient.user_id,
      fullName: data.patient.full_name,
      memberId: data.patient.member_id,
      planId: data.patient.plan_id,
      planName: data.patient.plan_name,
    },
    interpretation: {
      emergencyDetected: data.interpretation.emergency_detected,
      severityLevel: data.interpretation.severity_level,
      matchedEmergencyKeywords: data.interpretation.matched_emergency_keywords,
      symptomSummary: data.interpretation.symptom_summary,
      specialtyId: data.interpretation.specialty_id,
      specialtyName: data.interpretation.specialty_name,
      specialtyReason: data.interpretation.specialty_reason,
      aiConfidence: data.interpretation.ai_confidence,
    },
    recommendation: {
      hospitalId: data.recommendation.hospital_id,
      hospitalName: data.recommendation.hospital_name,
      specialtyId: data.recommendation.specialty_id,
      specialtyName: data.recommendation.specialty_name,
      estimatedPatientPayment: data.recommendation.estimated_patient_payment,
      currency: data.recommendation.currency,
      explanation: data.recommendation.explanation,
    },
    comparisons: data.comparisons.map(mapHospitalComparison),
    historySaved: data.history_saved,
    source: 'api',
  };
}

function mapHospitalComparison(
  hospital: HospitalComparisonResponseDto,
  index: number,
): HospitalComparison {
  return {
    hospitalId: hospital.hospital_id,
    hospitalName: hospital.hospital_name,
    city: hospital.city,
    inNetwork: hospital.in_network,
    networkStatus: hospital.network_status,
    coverageStatus: hospital.coverage_status,
    estimatedTotalPrice: hospital.estimated_total_price,
    estimatedPatientPayment: hospital.estimated_patient_payment,
    currency: hospital.currency,
    whyItMatches: hospital.why_it_matches,
    convenienceLabel: resolveConvenience(index),
  };
}

function resolveConvenience(index: number): string {
  if (index === 0) {
    return 'Mejor opción';
  }

  if (index === 1) {
    return 'Buena opción';
  }

  return 'Más costoso';
}
