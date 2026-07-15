import generatedCatalog from './generated/vehicle-catalog.json';
import { cars } from './db';

export type VehicleCatalogOption = {
  make: string;
  model: string;
  displayName: string;
  years: number[];
};

type GeneratedCatalog = {
  makes?: {
    name: string;
    slug: string;
    years?: Record<string, { name: string; slug: string }[]>;
  }[];
};

function displayName(make: string, model: string) {
  return `${make.replace(/-/g, ' ')} ${model.replace(/-/g, ' ')}`.replace(/\b\w/g, char => char.toUpperCase());
}

function fallbackCatalog(): VehicleCatalogOption[] {
  return cars.flatMap(car => car.models.map(model => ({
    make: car.make,
    model,
    displayName: displayName(car.make, model),
    years: buildYearRange(1996, 2026),
  })));
}

function buildGeneratedCatalog(): VehicleCatalogOption[] {
  const catalog = generatedCatalog as GeneratedCatalog;
  const byVehicle = new Map<string, VehicleCatalogOption>();

  for (const make of catalog.makes || []) {
    for (const [yearValue, models] of Object.entries(make.years || {})) {
      const year = Number(yearValue);
      if (!Number.isInteger(year) || !Array.isArray(models)) continue;

      for (const model of models) {
        const key = `${make.slug}/${model.slug}`;
        const existing = byVehicle.get(key);
        if (existing) {
          existing.years.push(year);
        } else {
          byVehicle.set(key, {
            make: make.slug,
            model: model.slug,
            displayName: `${make.name} ${model.name}`,
            years: [year],
          });
        }
      }
    }
  }

  return Array.from(byVehicle.values()).map(item => ({
    ...item,
    years: Array.from(new Set(item.years)).sort((a, b) => a - b),
  }));
}

export function getVehicleCatalogOptions() {
  const generated = buildGeneratedCatalog();
  return generated.length > 0 ? generated : fallbackCatalog();
}

function buildYearRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
