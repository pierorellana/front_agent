export interface CareEstimateRequestDto {
  document_number: string;
  symptom_text: string;
}

export interface ApiErrorDto {
  code: string;
  message: string;
  details: Record<string, unknown> | null;
}

export interface GeneralResponseDto<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  error: ApiErrorDto | null;
}

export interface CareEstimatePatientResponseDto {
  user_id: string | null;
  full_name: string | null;
  member_id: string | null;
  plan_id: string | null;
  plan_name: string | null;
}

export interface CareEstimateInterpretationResponseDto {
  emergency_detected: boolean;
  severity_level: string | null;
  matched_emergency_keywords: string[];
  symptom_summary: string;
  specialty_id: string;
  specialty_name: string;
  specialty_reason: string;
  ai_confidence: number | null;
}

export interface HospitalComparisonResponseDto {
  hospital_id: string;
  hospital_name: string;
  city: string | null;
  in_network: boolean;
  network_status: string | null;
  coverage_status: string | null;
  estimated_total_price: number;
  estimated_patient_payment: number;
  currency: string | null;
  why_it_matches: string[];
}

export interface CareEstimateRecommendationResponseDto {
  hospital_id: string;
  hospital_name: string;
  specialty_id: string;
  specialty_name: string;
  estimated_patient_payment: number;
  currency: string | null;
  explanation: string;
}

export interface CareEstimateResponseDto {
  patient: CareEstimatePatientResponseDto;
  interpretation: CareEstimateInterpretationResponseDto;
  recommendation: CareEstimateRecommendationResponseDto;
  comparisons: HospitalComparisonResponseDto[];
  history_saved: boolean;
}
