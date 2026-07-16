import generatedSpecs from './generated/vehicle-specs.json';
import { type VehicleYearTrimVariant, vehicleKnowledgeProfiles } from './vehicle-knowledge';

export type VehicleSpecRecord = VehicleYearTrimVariant & {
  make: string;
  model: string;
  displayName: string;
  generation: string;
};

type GeneratedVehicleSpecRecord = VehicleSpecRecord;

export const curatedVehicleSpecRecords: VehicleSpecRecord[] = vehicleKnowledgeProfiles.flatMap(vehicle => (vehicle.yearTrimVariants || []).map(variant => ({
  ...variant,
  make: vehicle.make,
  model: vehicle.model,
  displayName: vehicle.displayName || `${vehicle.make.replace('-', ' ')} ${vehicle.model.replace('-', ' ')}`.replace(/\b\w/g, c => c.toUpperCase()),
  generation: vehicle.generation,
})));

export const generatedVehicleSpecRecords = generatedSpecs as GeneratedVehicleSpecRecord[];

const rawVehicleSpecRecords: VehicleSpecRecord[] = [
  ...curatedVehicleSpecRecords,
  ...generatedVehicleSpecRecords,
];

export const allVehicleSpecRecords: VehicleSpecRecord[] = rawVehicleSpecRecords.filter(isCompleteVehicleSpecRecord);

export function isCompleteVehicleSpecRecord(item: VehicleSpecRecord) {
  const textFields = [
    item.make,
    item.model,
    item.displayName,
    item.generation,
    item.trim,
    item.slug,
    item.chassisCode,
    item.engineSummary,
    item.recommendedOil,
    item.oilCapacity,
    item.transmissionFluid,
  ];
  const arrayText = [
    ...(item.engineCodes || []),
    ...(item.commonProblems || []),
    ...(item.firstChecks || []),
  ];
  const joined = [...textFields, ...arrayText].join(' ').toLowerCase();
  const placeholderTerms = [
    'teknik profil',
    'technical profile technical profile',
    'pending profile',
    'data queue',
    'veri kuyru',
    'doldurulacak teknik alan',
    'engine code oil viscosity oil capacity',
  ];

  if (!Number.isInteger(Number(item.year))) return false;
  if (!item.make || !item.model || !item.slug) return false;
  if (!Array.isArray(item.engineCodes) || item.engineCodes.length === 0) return false;
  if (!item.recommendedOil || !item.oilCapacity || !item.transmissionFluid) return false;
  if (placeholderTerms.some(term => joined.includes(term))) return false;
  if (item.engineCodes.some(code => !code || code.toLowerCase().includes('technical profile') || code.toLowerCase().includes('teknik profil'))) return false;
  if (item.recommendedOil.toLowerCase() === item.trim.toLowerCase()) return false;
  if (item.oilCapacity.toLowerCase() === item.trim.toLowerCase()) return false;

  return true;
}

export function getVehicleSpecRecord(make: string, model: string, year: string | number, variant: string) {
  return allVehicleSpecRecords.find(item => item.make === make && item.model === model && item.year === Number(year) && item.slug === variant) || null;
}

export function getVehicleSpecRecordsForModel(make: string, model: string) {
  return allVehicleSpecRecords
    .filter(item => item.make === make && item.model === model)
    .sort((a, b) => a.year - b.year || a.trim.localeCompare(b.trim));
}

export function getVehicleSpecModelStaticParams() {
  const seen = new Set<string>();
  const params: { make: string; model: string }[] = [];

  for (const item of allVehicleSpecRecords) {
    const key = `${item.make}/${item.model}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ make: item.make, model: item.model });
  }

  return params;
}

export function getVehicleSpecStaticParams() {
  return allVehicleSpecRecords.map(item => ({
    make: item.make,
    model: item.model,
    year: String(item.year),
    variant: item.slug,
  }));
}
