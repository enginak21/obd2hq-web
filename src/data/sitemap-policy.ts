import rawBaseCodes from './base_codes.json';
import verifiedDtcGold from './verified_dtc_gold.json';
import verifiedDtcGoldBatch02 from './verified_dtc_gold_batch02.json';
import gscOpportunities from './generated/gsc-opportunities.json';
import fallbackGscSignalCodes from './generated/fallback-gsc-signal-codes.json';

type LocalizedText = string | string[] | Record<string, string | string[]>;
type CodeRecord = Record<string, unknown>;

function text(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  if (typeof value === 'object') {
    const record = value as Record<string, LocalizedText>;
    const preferred = record.en ?? Object.values(record)[0];
    return text(preferred);
  }
  return '';
}

function arrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

export function isRawGoldReadyCode(code: string, data: CodeRecord | undefined): boolean {
  if (!data) return false;
  return Boolean(
    /^[PCBU][0-9A-F]{4}$/.test(code) &&
    text(data.title) &&
    text(data.description).length >= 180 &&
    arrayLength(data.symptoms) >= 5 &&
    arrayLength(data.causes) >= 5 &&
    data.fixDifficulty &&
    data.estimatedCost
  );
}

const mergedCodes = {
  ...(rawBaseCodes as Record<string, CodeRecord>),
  ...(verifiedDtcGold as Record<string, CodeRecord>),
  ...(verifiedDtcGoldBatch02 as Record<string, CodeRecord>),
};

export const RAW_GOLD_CODE_SET = new Set(
  Object.entries(mergedCodes)
    .filter(([code, data]) => isRawGoldReadyCode(code, data))
    .map(([code]) => code.toUpperCase())
);

export const GSC_SIGNAL_CODE_SET = new Set(
  [
    ...(gscOpportunities as Array<{ query?: string; clicks?: number; impressions?: number }>)
      .filter((row) => Number(row.clicks || 0) > 0 || Number(row.impressions || 0) > 0)
      .flatMap((row) => (row.query || '').toUpperCase().match(/\b[PCBU][0-9A-F]{4}\b/g) || []),
    ...(fallbackGscSignalCodes as string[]),
  ].map((code) => code.toUpperCase())
);

export function isCodeHubSitemapEligible(code: string): boolean {
  const upper = code.toUpperCase();
  return RAW_GOLD_CODE_SET.has(upper) || GSC_SIGNAL_CODE_SET.has(upper);
}

export function getCodeHubSitemapReason(code: string): string {
  const upper = code.toUpperCase();
  if (RAW_GOLD_CODE_SET.has(upper)) return 'verified_raw_gold';
  if (GSC_SIGNAL_CODE_SET.has(upper)) return 'fallback_with_gsc_signal';
  return 'fallback_without_gsc_signal';
}
