import gscOpportunities from './generated/gsc-opportunities.json';
import type { GscOpportunity } from './gsc-seo';

export type VehicleCodeTarget = {
  locale?: string;
  make: string;
  model: string;
  code: string;
  priority?: string;
};

const editorialPriorityTargets: VehicleCodeTarget[] = [
  { make: 'ford', model: 'focus', code: 'P0213', priority: 'critical' },
  { make: 'suzuki', model: 'jimny', code: 'P0235', priority: 'critical' },
  { make: 'suzuki', model: 'jimny', code: 'P0203', priority: 'critical' },
  { make: 'suzuki', model: 'jimny', code: 'P0204', priority: 'critical' },
  { make: 'suzuki', model: 'jimny', code: 'P0234', priority: 'critical' },
  { make: 'suzuki', model: 'jimny', code: 'P0201', priority: 'high' },
  { make: 'suzuki', model: 'jimny', code: 'P0243', priority: 'high' },
  { make: 'ford', model: 'fiesta', code: 'P0216', priority: 'critical' },
  { make: 'ford', model: 'focus', code: 'P0103', priority: 'high' },
  { make: 'ford', model: 'ranger', code: 'P0110', priority: 'critical' },
  { make: 'ford', model: 'f-150', code: 'P0251', priority: 'critical' },
  { make: 'acura', model: 'tlx', code: 'P0102', priority: 'critical' },
  { make: 'honda', model: 'cr-v', code: 'P0135', priority: 'critical' },
  { make: 'lexus', model: 'is', code: 'P0125', priority: 'critical' },
  { make: 'toyota', model: 'camry', code: 'P0420', priority: 'high' },
  { make: 'toyota', model: 'camry', code: 'P0300', priority: 'high' },
  { make: 'nissan', model: 'altima', code: 'P0420', priority: 'high' },
  { make: 'nissan', model: 'altima', code: 'P0300', priority: 'high' },
  { make: 'ford', model: 'f-150', code: 'P0420', priority: 'high' },
  { make: 'ford', model: 'f-150', code: 'P0300', priority: 'high' },
  { make: 'honda', model: 'civic', code: 'P0420', priority: 'high' },
  { make: 'honda', model: 'civic', code: 'P0300', priority: 'high' },
];

function normalizeTarget(target: VehicleCodeTarget): VehicleCodeTarget {
  return {
    locale: target.locale,
    make: target.make.toLowerCase(),
    model: target.model.toLowerCase(),
    code: target.code.toUpperCase(),
    priority: target.priority,
  };
}

function parseVehicleCodeTarget(url: string): VehicleCodeTarget | null {
  const parts = url.split('/').filter(Boolean);
  if (parts.length !== 4) return null;
  const [locale, make, model, code] = parts;
  if (!/^[a-z]{2}$/.test(locale) || !/^[pcbu][0-9a-f]{4}$/i.test(code)) return null;
  return normalizeTarget({ locale, make, model, code, priority: 'gsc' });
}

export function getIndexableVehicleCodeTargets() {
  const targets = new Map<string, VehicleCodeTarget>();

  editorialPriorityTargets.map(normalizeTarget).forEach((target) => {
    targets.set(`${target.make}/${target.model}/${target.code}`, target);
  });

  (gscOpportunities as GscOpportunity[])
    .filter((opportunity) => opportunity.intentType === 'make_code' || opportunity.intentType === 'mixed_error')
    .map((opportunity) => parseVehicleCodeTarget(opportunity.targetUrl))
    .filter((target): target is VehicleCodeTarget => Boolean(target))
    .forEach((target) => {
      targets.set(`${target.make}/${target.model}/${target.code}`, target);
    });

  return Array.from(targets.values()).sort((a, b) => (
    a.make.localeCompare(b.make) ||
    a.model.localeCompare(b.model) ||
    a.code.localeCompare(b.code)
  ));
}

export function isIndexableVehicleCodePage(make: string, model: string, code: string) {
  const targetKey = `${make.toLowerCase()}/${model.toLowerCase()}/${code.toUpperCase()}`;
  return getIndexableVehicleCodeTargets().some((target) => `${target.make}/${target.model}/${target.code}` === targetKey);
}
