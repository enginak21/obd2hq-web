import type { VehicleSpecRecord } from './vehicle-spec-records';

export type VehicleSpecQuality = 'gold' | 'silver' | 'bronze';

const GENERIC_PATTERNS = [
  'verify by vin',
  'verify exact',
  'verify by exact',
  'varies by market',
  'depending on market',
  'market dependent',
  'market specific',
  'service information',
  'wheel package',
  'equipment package',
  'around ',
  'commonly around',
];

const BLOCKED_PATTERNS = [
  'teknik profil',
  'technical profile',
  'pending profile',
  'data queue',
  'veri kuyru',
  'doldurulacak teknik alan',
  'engine code oil viscosity oil capacity',
];

function normalize(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function hasUsefulArray(values: unknown, minimum = 1) {
  return Array.isArray(values) && values.filter(value => normalize(value).length > 0).length >= minimum;
}

function fullText(record: VehicleSpecRecord) {
  return [
    record.make,
    record.model,
    record.displayName,
    record.generation,
    record.trim,
    record.slug,
    record.chassisCode,
    record.bodyStyle,
    record.market,
    record.engineSummary,
    record.displacement,
    record.power,
    record.torque,
    record.fuelSystem,
    record.timingDrive,
    record.recommendedOil,
    record.oilCapacity,
    record.coolantCapacity,
    record.manualTransmission,
    record.automaticTransmission,
    record.transmissionFluid,
    record.differentialFluid,
    record.brakeFluid,
    record.sparkPlugs,
    record.serviceInterval,
    ...(record.engineCodes || []),
    ...(record.tireSizes || []),
    ...(record.commonProblems || []),
    ...(record.firstChecks || []),
    ...(record.relatedCodes || []),
    ...(record.notes || []),
    ...(record.sourceNotes || []),
  ].join(' ').toLowerCase();
}

export function isPublishableVehicleSpecRecord(record: VehicleSpecRecord) {
  const text = fullText(record);
  if (BLOCKED_PATTERNS.some(pattern => text.includes(pattern))) return false;
  if (!Number.isInteger(Number(record.year))) return false;
  if (!record.make || !record.model || !record.slug || !record.displayName) return false;
  if (!record.chassisCode || !record.engineSummary || !record.displacement) return false;
  if (!record.recommendedOil || !record.oilCapacity || !record.transmissionFluid) return false;
  if (!record.coolantCapacity || !record.brakeFluid || !record.sparkPlugs || !record.serviceInterval) return false;
  if (!hasUsefulArray(record.engineCodes)) return false;
  if (!hasUsefulArray(record.commonProblems, 2)) return false;
  if (!hasUsefulArray(record.firstChecks, 2)) return false;
  if (!hasUsefulArray(record.relatedCodes, 2)) return false;
  if (!hasUsefulArray(record.sourceNotes)) return false;
  return true;
}

export function getVehicleSpecQuality(record: VehicleSpecRecord): VehicleSpecQuality {
  if (!isPublishableVehicleSpecRecord(record)) return 'bronze';

  const text = fullText(record);
  const genericHits = GENERIC_PATTERNS.filter(pattern => text.includes(pattern)).length;
  const richSignals = [
    hasUsefulArray(record.commonProblems, 3),
    hasUsefulArray(record.firstChecks, 3),
    hasUsefulArray(record.notes, 2),
    hasUsefulArray(record.tireSizes, 1),
    normalize(record.power).length > 0 && normalize(record.torque).length > 0,
    normalize(record.fuelSystem).length > 0 && normalize(record.timingDrive).length > 0,
  ].filter(Boolean).length;

  if (genericHits <= 1 && richSignals >= 5) return 'gold';
  return 'silver';
}

export function getVehicleSpecQualityLabel(record: VehicleSpecRecord) {
  return getVehicleSpecQuality(record) === 'gold' ? 'Gold' : 'Silver';
}
