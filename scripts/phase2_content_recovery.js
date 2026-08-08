const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports/seo');
const BASE_URL = 'https://www.obd2hq.com';

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function readCsv(fileName) {
  const filePath = path.join(REPORT_DIR, fileName);
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8').trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.filter(Boolean).map(line => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function writeCsv(fileName, rows, columns) {
  const content = [
    columns.join(','),
    ...rows.map(row => columns.map(column => escapeCsv(row[column])).join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(REPORT_DIR, fileName), `${content}\n`);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function codeSystem(code) {
  const upper = String(code).toUpperCase();
  if (upper.startsWith('B')) return 'body_srs_comfort';
  if (upper.startsWith('C')) return 'chassis_abs_steering_suspension';
  if (upper.startsWith('U')) return 'network_communication';
  if (/^P00/.test(upper)) return 'fuel_air_metering';
  if (/^P01/.test(upper)) return 'sensor_air_fuel_o2';
  if (/^P02[0-2]/.test(upper)) return 'injector_cylinder_fuel_control';
  if (/^P02[3-5]|^P22|^P25/.test(upper)) return 'boost_turbo_fuel_pressure';
  if (/^P03/.test(upper)) return 'misfire_ignition';
  if (/^P04/.test(upper)) return 'emissions_egr_evap';
  if (/^P05/.test(upper)) return 'idle_speed_vehicle_speed';
  if (/^P06/.test(upper)) return 'control_module_output_circuit';
  if (/^P07|^P08/.test(upper)) return 'transmission';
  return 'powertrain_general';
}

function baseSearchDemand(code) {
  const upper = String(code).toUpperCase();
  if (/^P0[0-4]/.test(upper)) return 24;
  if (/^P07|^P08/.test(upper)) return 18;
  if (/^U0/.test(upper)) return 14;
  if (/^B0|^C0/.test(upper)) return 12;
  return 8;
}

function diagnosticUsefulness(code) {
  const system = codeSystem(code);
  if (['misfire_ignition', 'boost_turbo_fuel_pressure', 'sensor_air_fuel_o2', 'injector_cylinder_fuel_control'].includes(system)) return 18;
  if (['transmission', 'emissions_egr_evap', 'fuel_air_metering'].includes(system)) return 16;
  if (['chassis_abs_steering_suspension', 'network_communication'].includes(system)) return 14;
  return 10;
}

function failureStrategy(pageType, reason) {
  if (pageType === 'code_hub') return 'Build verified raw DTC record first; do not inflate with generic text. Prioritize by GSC and diagnostic usefulness.';
  if (pageType === 'vehicle_spec') return 'Enrich required vehicle technical fields or keep out of quality sitemap candidates.';
  if (pageType === 'other') return 'Manually map to a known intent or consolidate into a stronger hub.';
  return reason || 'Manual quality review required.';
}

function intentKeyFromUrl(targetUrl) {
  const clean = String(targetUrl || '').split('?')[0].toLowerCase();
  const parts = clean.split('/').filter(Boolean);
  const code = (clean.match(/\b[pcbu][0-9a-f]{4}\b/i) || [''])[0].toUpperCase();
  if (!code) return clean || 'unknown';
  if (parts.length >= 4 && parts[0] === 'en') return `${parts[1]}:${parts[2]}:${code}`;
  if (parts.length >= 2 && ['codes', 'kodlar', 'codigos'].includes(parts[1])) return `general:${code}`;
  return `mixed:${code}`;
}

function ownershipQuery(query) {
  const normalized = String(query || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const code = (normalized.match(/\b[pcbu][0-9a-f]{4}\b/i) || [''])[0].toUpperCase();
  if (!code) return normalized;
  const vehicleWords = normalized.replace(code.toLowerCase(), '').trim();
  if (!vehicleWords) return `general:${code}`;
  return `${vehicleWords}:${code}`;
}

function decisionForGsc(row, seoByPath) {
  const position = number(row.position);
  const impressions = number(row.impressions);
  const clicks = number(row.clicks);
  const target = row.targetUrl || '';
  const quality = seoByPath.get(target) || seoByPath.get(`${BASE_URL}${target}`) || {};
  const classification = quality.classification || 'UNKNOWN';
  if (classification === 'THIN') return 'IMPROVE';
  if (position >= 4 && position <= 20 && impressions >= 10) return 'IMPROVE';
  if (clicks > 0 && position <= 10) return 'KEEP';
  if (/news\//.test(target) && !/obd|dtc|warning|code|p[0-9]/i.test(row.query || '')) return 'REVIEW';
  if (classification === 'UTILITY' || classification === 'INVALID') return 'CONSOLIDATE';
  return 'REVIEW';
}

function makeThinDistribution(seoRows) {
  const thinRows = seoRows.filter(row => row.classification === 'THIN');
  const totalThin = thinRows.length || 1;
  const grouped = new Map();
  for (const row of thinRows) {
    const key = row.page_type || 'unknown';
    if (!grouped.has(key)) grouped.set(key, { page_type: key, thin_count: 0, reasons: new Map(), strategies: new Map() });
    const group = grouped.get(key);
    group.thin_count += 1;
    group.reasons.set(row.reason, (group.reasons.get(row.reason) || 0) + 1);
    group.strategies.set(row.recommended_action, (group.strategies.get(row.recommended_action) || 0) + 1);
  }
  return [...grouped.values()].sort((a, b) => b.thin_count - a.thin_count).map(group => {
    const mainReason = [...group.reasons.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const mainStrategy = failureStrategy(group.page_type, [...group.strategies.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '');
    return {
      page_type: group.page_type,
      thin_count: group.thin_count,
      percentage: ((group.thin_count / totalThin) * 100).toFixed(2),
      main_failure_reason: mainReason,
      recommended_strategy: mainStrategy,
    };
  });
}

function makeFallbackQueue(fallbackRows, gscRows) {
  const gscByCode = new Map();
  for (const row of gscRows) {
    const matches = String(row.query || '').toUpperCase().match(/\b[PCBU][0-9A-F]{4}\b/g) || [];
    for (const code of matches) {
      if (!gscByCode.has(code)) gscByCode.set(code, { impressions: 0, clicks: 0, bestPosition: 999, targets: new Set(), queries: new Set() });
      const item = gscByCode.get(code);
      item.impressions += number(row.impressions);
      item.clicks += number(row.clicks);
      item.bestPosition = Math.min(item.bestPosition, number(row.position) || 999);
      item.targets.add(row.targetUrl || '');
      item.queries.add(row.query || '');
    }
  }
  return fallbackRows
    .filter(row => row.runtime_fallback_needed === 'yes')
    .map(row => {
      const code = row.code.toUpperCase();
      const gsc = gscByCode.get(code) || { impressions: number(row.gsc_impressions), clicks: number(row.gsc_clicks), bestPosition: 999, targets: new Set(), queries: new Set() };
      const impressions = Math.max(number(row.gsc_impressions), gsc.impressions);
      const clicks = Math.max(number(row.gsc_clicks), gsc.clicks);
      const positionBonus = gsc.bestPosition <= 20 ? 16 : gsc.bestPosition <= 50 ? 8 : 0;
      const contentWeakness = row.similarity_risk === 'high' ? 14 : row.similarity_risk === 'medium' ? 8 : 4;
      const internalAuthority = [...gsc.targets].some(target => /\/en\/[^/]+\/[^/]+\//.test(target)) ? 8 : 4;
      const score = Math.min(100, Math.round(
        Math.min(25, impressions / 2) +
        Math.min(20, clicks * 8) +
        positionBonus +
        baseSearchDemand(code) +
        diagnosticUsefulness(code) +
        contentWeakness +
        internalAuthority
      ));
      return {
        code,
        recovery_score: score,
        historical_impressions: impressions,
        historical_clicks: clicks,
        best_position_seen: gsc.bestPosition === 999 ? '' : gsc.bestPosition,
        search_demand_score: baseSearchDemand(code),
        diagnostic_usefulness_score: diagnosticUsefulness(code),
        content_weakness: row.similarity_risk,
        existing_internal_authority: internalAuthority >= 8 ? 'vehicle-targeted' : 'general',
        code_system: codeSystem(code),
        recommended_strategy: 'Create verified raw-gold DTC record before sitemap expansion; add code-specific diagnostic sequence and semantic links.',
        target_primary_url: `/en/codes/${code.toLowerCase()}`,
        supporting_vehicle_urls: [...gsc.targets].filter(Boolean).slice(0, 5).join(' | '),
        triggering_queries: [...gsc.queries].filter(Boolean).slice(0, 5).join(' | '),
      };
    })
    .sort((a, b) => b.recovery_score - a.recovery_score || b.historical_impressions - a.historical_impressions)
    .slice(0, 100);
}

function makeCannibalizationReport(gscRows) {
  const grouped = new Map();
  for (const row of gscRows) {
    const key = ownershipQuery(row.query);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  const rows = [];
  for (const [key, items] of grouped.entries()) {
    const targets = [...new Set(items.map(row => row.targetUrl).filter(Boolean))];
    const queries = [...new Set(items.map(row => row.query).filter(Boolean))];
    const code = (key.match(/\b[PCBU][0-9A-F]{4}\b/) || [''])[0];
    const preferred = targets.find(target => code && target.includes(`/codes/${code.toLowerCase()}`)) || targets.sort((a, b) => {
      const aScore = items.filter(row => row.targetUrl === a).reduce((sum, row) => sum + number(row.clicks) * 10 + number(row.impressions), 0);
      const bScore = items.filter(row => row.targetUrl === b).reduce((sum, row) => sum + number(row.clicks) * 10 + number(row.impressions), 0);
      return bScore - aScore;
    })[0] || '';
    if (targets.length > 1 || /general:/.test(key)) {
      rows.push({
        intent_key: key,
        query_examples: queries.slice(0, 6).join(' | '),
        competing_url_count: targets.length,
        competing_urls: targets.join(' | '),
        preferred_url: preferred,
        risk: targets.length >= 3 ? 'high' : targets.length === 2 ? 'medium' : 'low',
        recommended_action: targets.length > 1 ? 'Keep one intent owner and make supporting pages link to it with distinct intent copy.' : 'Maintain a single clear intent owner.',
      });
    }
  }
  return rows.sort((a, b) => b.competing_url_count - a.competing_url_count || String(a.intent_key).localeCompare(String(b.intent_key)));
}

function makeGscDecisions(gscRows, seoRows) {
  const seoByPath = new Map();
  for (const row of seoRows) {
    try {
      const url = new URL(row.URL);
      seoByPath.set(url.pathname, row);
      seoByPath.set(row.URL, row);
    } catch {}
  }
  return gscRows.map(row => {
    const target = row.targetUrl || '';
    const quality = seoByPath.get(target) || {};
    return {
      rank: row.rank,
      query: row.query,
      targetUrl: target,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      current_quality_score: quality.quality_score || '',
      current_classification: quality.classification || 'UNKNOWN',
      decision: decisionForGsc(row, seoByPath),
      recommended_action: row.recommendedAction || 'Review and strengthen only if intent is verified.',
    };
  });
}

function reportMarkdown(thinDistribution, fallbackQueue, cannibalizationRows, gscDecisionRows, seoRows, fallbackRows) {
  const counts = seoRows.reduce((acc, row) => {
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    return acc;
  }, {});
  const rawGold = fallbackRows.filter(row => row.raw_gold === 'yes').length;
  const fallback = fallbackRows.filter(row => row.runtime_fallback_needed === 'yes').length;
  const gscDecisions = gscDecisionRows.reduce((acc, row) => {
    acc[row.decision] = (acc[row.decision] || 0) + 1;
    return acc;
  }, {});
  return `# OBD2HQ Phase 2 Recovery Report

Generated: ${new Date().toISOString()}

Canonical/domain/URL structure changes made: 0

URLs created: 0

URLs removed: 0

URLs noindexed: 0

## Before

Gold: 11,720

Silver: 6,460

Thin: 9,155

Raw Gold OBD: 376

Fallback OBD: 1,847

## After / Current Audit

Gold: ${counts.GOLD || 0}

Silver: ${counts.SILVER || 0}

Thin: ${counts.THIN || 0}

Raw Gold OBD: ${rawGold}

Fallback OBD: ${fallback}

## Thin Page Distribution

${thinDistribution.map(row => `- ${row.page_type}: ${row.thin_count} (${row.percentage}%) - ${row.main_failure_reason}`).join('\n')}

Main finding: thin pages are overwhelmingly concentrated in the fallback code hub template, not spread evenly across the whole site.

## First 100 Fallback Upgrade Queue

The file \`OBD_GOLD_UPGRADE_QUEUE.csv\` contains the first 100 fallback codes ranked by RECOVERY_SCORE. These are not marked Gold yet; they are the priority work queue for verified raw DTC enrichment.

Top 10:

${fallbackQueue.slice(0, 10).map(row => `- ${row.code}: score ${row.recovery_score}, system ${row.code_system}, impressions ${row.historical_impressions}, clicks ${row.historical_clicks}`).join('\n')}

## Information Gain Policy

Gold candidates must add code-specific detection logic, component context, diagnostic sequence, live-data/freeze-frame interpretation where applicable, electrical/mechanical test relevance, repair paths and FAQ. Code number, component name and vehicle name swaps are not sufficient.

## Cannibalization Findings

Potential cannibalization rows: ${cannibalizationRows.length}

High risk rows: ${cannibalizationRows.filter(row => row.risk === 'high').length}

Medium risk rows: ${cannibalizationRows.filter(row => row.risk === 'medium').length}

## GSC Recovery Targets

KEEP: ${gscDecisions.KEEP || 0}

IMPROVE: ${gscDecisions.IMPROVE || 0}

CONSOLIDATE: ${gscDecisions.CONSOLIDATE || 0}

REVIEW: ${gscDecisions.REVIEW || 0}

## Internal Links Added

0 in this phase. This pass intentionally produces the verified target map first. Internal links should be added only after each fallback code is upgraded to verified raw Gold.

## Required Next Step

Start with the first rows in \`OBD_GOLD_UPGRADE_QUEUE.csv\`. Upgrade raw code data only when the DTC-specific information gain test passes; otherwise keep the URL as a review candidate rather than creating fake Gold content.
`;
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const seoRows = readCsv('SEO_INDEX_QUALITY.csv');
  const fallbackRows = readCsv('OBD_FALLBACK_SIMILARITY.csv');
  const gscRows = readCsv('GSC_TOP_100_RECOVERY.csv');

  const thinDistribution = makeThinDistribution(seoRows);
  const fallbackQueue = makeFallbackQueue(fallbackRows, gscRows);
  const cannibalizationRows = makeCannibalizationReport(gscRows);
  const gscDecisionRows = makeGscDecisions(gscRows, seoRows);

  writeCsv('THIN_URL_DISTRIBUTION.csv', thinDistribution, ['page_type', 'thin_count', 'percentage', 'main_failure_reason', 'recommended_strategy']);
  writeCsv('OBD_GOLD_UPGRADE_QUEUE.csv', fallbackQueue, ['code', 'recovery_score', 'historical_impressions', 'historical_clicks', 'best_position_seen', 'search_demand_score', 'diagnostic_usefulness_score', 'content_weakness', 'existing_internal_authority', 'code_system', 'recommended_strategy', 'target_primary_url', 'supporting_vehicle_urls', 'triggering_queries']);
  writeCsv('SEO_CANNIBALIZATION_REPORT.csv', cannibalizationRows, ['intent_key', 'query_examples', 'competing_url_count', 'competing_urls', 'preferred_url', 'risk', 'recommended_action']);
  writeCsv('GSC_RECOVERY_DECISIONS.csv', gscDecisionRows, ['rank', 'query', 'targetUrl', 'clicks', 'impressions', 'ctr', 'position', 'current_quality_score', 'current_classification', 'decision', 'recommended_action']);
  fs.writeFileSync(path.join(REPORT_DIR, 'PHASE2_RECOVERY_REPORT.md'), reportMarkdown(thinDistribution, fallbackQueue, cannibalizationRows, gscDecisionRows, seoRows, fallbackRows));

  const fail = [];
  if (!thinDistribution.length) fail.push('Thin distribution is empty.');
  if (fallbackQueue.length !== 100) fail.push(`Fallback queue contains ${fallbackQueue.length} rows, expected 100.`);
  if (!gscDecisionRows.length) fail.push('GSC recovery decisions are empty.');
  if (fail.length) {
    console.error(fail.join('\n'));
    process.exit(1);
  }
  console.log(`Phase 2 reports generated. Thin groups: ${thinDistribution.length}. Fallback queue: ${fallbackQueue.length}. Cannibalization rows: ${cannibalizationRows.length}.`);
}

main();
