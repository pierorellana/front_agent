import {
  CareEstimate,
  EstimateCareCommand,
  HospitalComparison,
} from '../../core/domain/entities/care-estimate.entity';

export function buildDemoCareEstimate(command: EstimateCareCommand): CareEstimate {
  const specialty = inferDemoSpecialty(command.symptomText);
  const comparisons: HospitalComparison[] = [
    {
      hospitalId: 'hosp_metro_general',
      hospitalName: 'Metro General Hospital',
      city: 'Guayaquil',
      inNetwork: true,
      networkStatus: 'In network',
      coverageStatus: 'Configured',
      estimatedTotalPrice: 30,
      estimatedPatientPayment: 6,
      currency: 'USD',
      whyItMatches: [
        'Está dentro de la red del plan.',
        `La especialidad evaluada es ${specialty.name}.`,
        'Tiene la menor estimación de pago para el paciente.',
      ],
      convenienceLabel: 'Mejor opción',
    },
    {
      hospitalId: 'hosp_city_heart',
      hospitalName: 'City Heart Institute',
      city: 'Guayaquil',
      inNetwork: true,
      networkStatus: 'In network',
      coverageStatus: 'Configured',
      estimatedTotalPrice: 45,
      estimatedPatientPayment: 9,
      currency: 'USD',
      whyItMatches: [
        'Está dentro de la red del plan.',
        'Mantiene cobertura activa para la especialidad.',
      ],
      convenienceLabel: 'Buena opción',
    },
    {
      hospitalId: 'hosp_vitalia',
      hospitalName: 'Vitalia Medical Tower',
      city: 'Guayaquil',
      inNetwork: true,
      networkStatus: 'In network',
      coverageStatus: 'Configured',
      estimatedTotalPrice: 60,
      estimatedPatientPayment: 12,
      currency: 'USD',
      whyItMatches: [
        'Está dentro de la red del plan.',
        'Su tarifa base es más alta que las otras opciones.',
      ],
      convenienceLabel: 'Más costoso',
    },
  ];

  return {
    patient: {
      userId: command.documentNumber,
      fullName: 'Paciente Demo',
      memberId: command.documentNumber,
      planId: 'salud_plus',
      planName: 'Salud Plus',
    },
    interpretation: {
      emergencyDetected: specialty.emergency,
      severityLevel: specialty.emergency ? 'high' : 'moderate',
      matchedEmergencyKeywords: specialty.emergency ? ['dolor en el pecho', 'respirar'] : [],
      symptomSummary: `Paciente reporta: ${command.symptomText}`,
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      specialtyReason: specialty.reason,
      aiConfidence: specialty.emergency ? 0.97 : 0.91,
    },
    recommendation: {
      hospitalId: comparisons[0].hospitalId,
      hospitalName: comparisons[0].hospitalName,
      specialtyId: specialty.id,
      specialtyName: specialty.name,
      estimatedPatientPayment: comparisons[0].estimatedPatientPayment,
      currency: 'USD',
      explanation:
        'La opción recomendada combina cobertura activa, menor copago estimado y disponibilidad dentro de la red del plan.',
    },
    comparisons,
    historySaved: false,
    source: 'demo',
  };
}

function inferDemoSpecialty(symptomText: string): {
  id: string;
  name: string;
  reason: string;
  emergency: boolean;
} {
  const normalized = symptomText.toLowerCase();

  if (normalized.includes('pecho') || normalized.includes('respirar')) {
    return {
      id: 'emergencias',
      name: 'Emergencias',
      reason: 'Se detectaron síntomas de posible urgencia y se prioriza atención inmediata.',
      emergency: true,
    };
  }

  if (normalized.includes('garganta') || normalized.includes('fiebre')) {
    return {
      id: 'medicina_general',
      name: 'Medicina General',
      reason: 'Los síntomas respiratorios y fiebre encajan con una primera evaluación clínica general.',
      emergency: false,
    };
  }

  return {
    id: 'medicina_general',
    name: 'Medicina General',
    reason: 'La descripción inicial puede evaluarse por medicina general antes de derivar.',
    emergency: false,
  };
}
