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

export const allVehicleSpecRecords: VehicleSpecRecord[] = [
  ...curatedVehicleSpecRecords,
  ...generatedVehicleSpecRecords,
];

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
