import { allVehicleSpecRecords } from './vehicle-spec-records';

export type VehicleCatalogOption = {
  make: string;
  model: string;
  displayName: string;
  years: number[];
};

export function getVehicleCatalogOptions() {
  const byVehicle = new Map<string, VehicleCatalogOption>();

  for (const record of allVehicleSpecRecords) {
    const key = `${record.make}/${record.model}`;
    const existing = byVehicle.get(key);

    if (existing) {
      existing.years.push(record.year);
      continue;
    }

    byVehicle.set(key, {
      make: record.make,
      model: record.model,
      displayName: record.displayName,
      years: [record.year],
    });
  }

  return Array.from(byVehicle.values()).map(item => ({
    ...item,
    years: Array.from(new Set(item.years)).sort((a, b) => a - b),
  }));
}
