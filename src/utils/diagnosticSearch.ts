export type VehicleOption = {
  make: string;
  models: string[];
};

export type ParsedDiagnosticQuery = {
  code: string | null;
  make: string | null;
  model: string | null;
};

export function formatVehicleName(value: string) {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function normalizeCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = compact.match(/[PCBU][0-9]{4}/);
  return match ? match[0] : null;
}

export function parseDiagnosticQuery(query: string, vehicles: VehicleOption[]): ParsedDiagnosticQuery {
  const normalizedQuery = normalizeSearchText(query);
  const code = normalizeCode(query);
  const withoutCode = code ? normalizedQuery.replace(normalizeSearchText(code), '') : normalizedQuery;

  let make: string | null = null;
  let model: string | null = null;

  for (const vehicle of vehicles) {
    const normalizedMake = normalizeSearchText(vehicle.make);
    const makeMatches = withoutCode.includes(normalizedMake);

    for (const candidateModel of vehicle.models) {
      const normalizedModel = normalizeSearchText(candidateModel);
      if (withoutCode.includes(normalizedModel)) {
        make = vehicle.make;
        model = candidateModel;
        return { code, make, model };
      }
    }

    if (makeMatches && !make) {
      make = vehicle.make;
    }
  }

  return { code, make, model };
}

export function getDiagnosticSearchTarget(locale: string, query: string, vehicles: VehicleOption[]) {
  const parsed = parseDiagnosticQuery(query, vehicles);

  if (parsed.code && parsed.make && parsed.model) {
    return `/${locale}/${parsed.make}/${parsed.model}/${parsed.code.toLowerCase()}`;
  }

  if (!parsed.code && parsed.make && parsed.model) {
    return `/${locale}/${parsed.make}/${parsed.model}`;
  }

  if (!parsed.code && parsed.make) {
    return `/${locale}/${parsed.make}`;
  }

  return `/${locale}/search?q=${encodeURIComponent(query.trim())}`;
}

export function findVehicleMatches(query: string, vehicles: VehicleOption[], limit = 6) {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length < 2) return [];

  const matches: Array<{ make: string; model: string | null; label: string; hrefPart: string }> = [];

  for (const vehicle of vehicles) {
    const normalizedMake = normalizeSearchText(vehicle.make);
    if (normalizedMake.includes(normalizedQuery) || normalizedQuery.includes(normalizedMake)) {
      matches.push({
        make: vehicle.make,
        model: null,
        label: formatVehicleName(vehicle.make),
        hrefPart: vehicle.make,
      });
    }

    for (const model of vehicle.models) {
      const normalizedModel = normalizeSearchText(model);
      const combined = normalizeSearchText(`${vehicle.make}${model}`);
      if (normalizedModel.includes(normalizedQuery) || combined.includes(normalizedQuery)) {
        matches.push({
          make: vehicle.make,
          model,
          label: `${formatVehicleName(vehicle.make)} ${formatVehicleName(model)}`,
          hrefPart: `${vehicle.make}/${model}`,
        });
      }
    }
  }

  return matches.slice(0, limit);
}
