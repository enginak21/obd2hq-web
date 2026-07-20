export type ObdCodeFamily = 'powertrain' | 'chassis' | 'body' | 'network';
export type ObdStandardType = 'generic_standard' | 'manufacturer_specific' | 'mixed_or_extended';

export type ObdGoldRegistryEntry = {
  code: string;
  family: ObdCodeFamily;
  standardType: ObdStandardType;
  standardLabel: string;
  goldRequirements: string[];
  sourceBasis: string;
};

const familyLabels: Record<string, ObdCodeFamily> = {
  P: 'powertrain',
  C: 'chassis',
  B: 'body',
  U: 'network',
};

export function getObdGoldRegistryEntry(code: string): ObdGoldRegistryEntry {
  const upperCode = code.toUpperCase();
  const prefix = upperCode[0];
  const second = upperCode[1];
  const family = familyLabels[prefix] || 'powertrain';
  const standardType = getStandardType(prefix, second, upperCode);

  return {
    code: upperCode,
    family,
    standardType,
    standardLabel: getStandardLabel(standardType),
    goldRequirements: [
      'standard code meaning',
      'vehicle-specific diagnostic priority',
      'symptoms and related codes',
      'first checks before parts replacement',
      'live-data or circuit verification path',
      'safe-to-drive guidance',
      'repair verification step',
    ],
    sourceBasis: 'SAE J2012 / ISO 15031-6 diagnostic trouble code structure with OBD2HQ editorial diagnostic layering.',
  };
}

function getStandardType(prefix: string, second: string, code: string): ObdStandardType {
  if (second === '0') return 'generic_standard';
  if (prefix === 'P' && second === '2') return 'generic_standard';
  if (prefix === 'P' && second === '3') {
    const numeric = Number(code.slice(1));
    return numeric >= 3400 && numeric <= 3999 ? 'generic_standard' : 'mixed_or_extended';
  }
  if (second === '1') return 'manufacturer_specific';
  return 'mixed_or_extended';
}

function getStandardLabel(type: ObdStandardType) {
  if (type === 'generic_standard') return 'Generic SAE/ISO OBD-II code';
  if (type === 'manufacturer_specific') return 'Manufacturer-specific OBD-II code';
  return 'Extended or mixed-definition OBD-II code';
}

export function getLocalizedRegistryCopy(locale: string, entry: ObdGoldRegistryEntry, make: string, model: string) {
  const vehicle = `${make} ${model}`;
  if (locale === 'tr') {
    return {
      title: 'Kod doğrulama standardı',
      family: `Kod ailesi: ${entry.family}`,
      standard: `Standart türü: ${entry.standardLabel}`,
      source: `${entry.code}, OBD2HQ içinde SAE J2012 / ISO 15031-6 kod yapısı ve ${vehicle} araç bağlamı birlikte değerlendirilerek yayınlanır.`,
      gold: 'Bu sayfa yalnızca kod adını değil; belirti, ilk kontrol, canlı veri, yanlış teşhis riski ve onarım doğrulamasını birlikte verir.',
    };
  }
  if (locale === 'de') {
    return {
      title: 'Code verification standard',
      family: `Code family: ${entry.family}`,
      standard: `Standard type: ${entry.standardLabel}`,
      source: `${entry.code} is published with SAE J2012 / ISO 15031-6 code structure plus ${vehicle} diagnostic context.`,
      gold: 'This page covers meaning, symptoms, first checks, live data, misdiagnosis risk, and repair verification.',
    };
  }
  if (locale === 'es') {
    return {
      title: 'Estándar de verificación del código',
      family: `Familia del código: ${entry.family}`,
      standard: `Tipo estándar: ${entry.standardLabel}`,
      source: `${entry.code} se publica con estructura SAE J2012 / ISO 15031-6 y contexto diagnóstico para ${vehicle}.`,
      gold: 'La página incluye significado, síntomas, primeras revisiones, datos en vivo, errores comunes y verificación de reparación.',
    };
  }
  if (locale === 'fr') {
    return {
      title: 'Standard de vérification du code',
      family: `Famille du code : ${entry.family}`,
      standard: `Type standard : ${entry.standardLabel}`,
      source: `${entry.code} est publié avec la structure SAE J2012 / ISO 15031-6 et le contexte de diagnostic ${vehicle}.`,
      gold: 'La page couvre le sens, les symptômes, les premiers contrôles, les données en direct, les erreurs de diagnostic et la vérification.',
    };
  }
  return {
    title: 'Code verification standard',
    family: `Code family: ${entry.family}`,
    standard: `Standard type: ${entry.standardLabel}`,
    source: `${entry.code} is published with SAE J2012 / ISO 15031-6 code structure plus ${vehicle} diagnostic context.`,
    gold: 'This page covers meaning, symptoms, first checks, live data, misdiagnosis risk, and repair verification.',
  };
}
