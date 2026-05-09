export type EstimateSource = 'api' | 'demo';

export interface EstimateCareCommand {
  documentNumber: string;
  symptomText: string;
}

export interface PatientProfile {
  userId: string | null;
  fullName: string | null;
  memberId: string | null;
  planId: string | null;
  planName: string | null;
}

export interface SpecialtyInterpretation {
  emergencyDetected: boolean;
  severityLevel: string | null;
  matchedEmergencyKeywords: string[];
  symptomSummary: string;
  specialtyId: string;
  specialtyName: string;
  specialtyReason: string;
  aiConfidence: number | null;
}

export interface HospitalComparison {
  hospitalId: string;
  hospitalName: string;
  city: string | null;
  inNetwork: boolean;
  networkStatus: string | null;
  coverageStatus: string | null;
  estimatedTotalPrice: number;
  estimatedPatientPayment: number;
  currency: string | null;
  whyItMatches: string[];
  convenienceLabel: string;
}

export interface CareRecommendation {
  hospitalId: string;
  hospitalName: string;
  specialtyId: string;
  specialtyName: string;
  estimatedPatientPayment: number;
  currency: string | null;
  explanation: string;
}

export interface CareEstimate {
  patient: PatientProfile;
  interpretation: SpecialtyInterpretation;
  recommendation: CareRecommendation;
  comparisons: HospitalComparison[];
  historySaved: boolean;
  source: EstimateSource;
}

export interface CopayBreakdown {
  hospitalTariff: number;
  coveredAmount: number;
  patientPayment: number;
  coveragePercent: number;
  currency: string | null;
}
