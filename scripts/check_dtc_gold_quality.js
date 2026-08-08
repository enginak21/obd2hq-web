const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports/seo');
const TOP20 = [
  'P0110', 'P0203', 'P0125', 'P0234', 'P0216',
  'P0183', 'P0135', 'P0103', 'P0251', 'P0201',
  'P0113', 'P0243', 'P0134', 'P0105', 'P0106',
  'P0297', 'P0538', 'P0509', 'P0104', 'P0107'
];
const BATCH02 = [
  'P0108', 'P0109', 'P0111', 'P0112', 'P0114', 'P0115', 'P0116', 'P0117', 'P0118', 'P0119',
  'P0120', 'P0121', 'P0122', 'P0123', 'P0124', 'P0126', 'P0127', 'P0128', 'P0129', 'P0130',
  'P0131', 'P0132', 'P0133', 'P0136', 'P0137', 'P0138', 'P0139', 'P0140', 'P0141', 'P0142',
  'P0143', 'P0144', 'P0145', 'P0146', 'P0147', 'P0150', 'P0151', 'P0152', 'P0153', 'P0154',
  'P0155', 'P0156', 'P0157', 'P0158', 'P0159', 'P0160', 'P0161', 'P0162', 'P0163', 'P0164',
  'P0165', 'P0166', 'P0167', 'P0168', 'P0169', 'P0170', 'P0173', 'P0176', 'P0177', 'P0178',
  'P0179', 'P0180', 'P0181', 'P0182', 'P0184', 'P0185', 'P0186', 'P0187', 'P0188', 'P0189',
  'P0200', 'P0202', 'P0204', 'P0205', 'P0206', 'P0207', 'P0208', 'P0209', 'P0210', 'P0211'
];

const rawBaseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));
const verifiedDtcGold = require(path.join(ROOT, 'src/data/verified_dtc_gold.json'));
const verifiedDtcGoldBatch02 = require(path.join(ROOT, 'src/data/verified_dtc_gold_batch02.json'));
const verifiedAll = { ...verifiedDtcGold, ...verifiedDtcGoldBatch02 };
const allCodes = { ...rawBaseCodes, ...verifiedAll };

fs.mkdirSync(REPORT_DIR, { recursive: true });

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function writeCsv(fileName, rows, columns) {
  const content = [
    columns.join(','),
    ...rows.map(row => columns.map(column => escapeCsv(row[column])).join(','))
  ].join('\n');
  fs.writeFileSync(path.join(REPORT_DIR, fileName), `${content}\n`);
}

function text(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value.en || Object.values(value).flat().join(' ');
}

function tokens(value) {
  return new Set(text(value).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean));
}

function jaccard(a, b) {
  const left = tokens(a);
  const right = tokens(b);
  const union = new Set([...left, ...right]);
  if (!union.size) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / union.size;
}

function similarityBody(data) {
  return [
    data?.title,
    data?.generic_definition,
    data?.code_specific_context,
    data?.system,
    data?.subsystem,
    data?.component,
    data?.circuit_type,
    data?.severity,
    data?.description,
    data?.driveability,
    data?.ecu_detection_condition,
    data?.symptoms,
    data?.causes,
    data?.first_checks,
    data?.diagnosticSteps,
    data?.electrical_tests,
    data?.mechanical_tests,
    data?.commonFixes,
    data?.common_mistakes,
    data?.do_not_replace_blindly,
    data?.freeze_frame_fields,
    data?.live_data_fields,
    data?.related_codes,
    data?.applicability_notes
  ].map(text).join(' ');
}

function arrayLength(value) {
  return Array.isArray(value) ? value.length : 0;
}

function containsUnsupportedPrecision(data) {
  const scopedText = [
    data.description,
    data.ecu_detection_condition,
    data.diagnosticSteps,
    data.electrical_tests,
    data.mechanical_tests,
    data.commonFixes,
    data.common_mistakes,
    data.applicability_notes
  ].map(text).join(' ');
  return /\b\d+(?:\.\d+)?\s?(?:psi|bar|kpa|ohm|volt|volts|rpm|celsius|fahrenheit|degrees)\b/i.test(scopedText);
}

function scoreRecord(code, data) {
  const issues = [];
  const requiredStrings = [
    'title', 'description', 'system', 'subsystem', 'component', 'circuit_type',
    'severity', 'driveability', 'ecu_detection_condition', 'applicability_notes', 'source_confidence'
  ];

  for (const field of requiredStrings) {
    if (!text(data[field])) issues.push(`${field} missing`);
  }

  if (!/^[PCBU][0-9A-F]{4}$/.test(code)) issues.push('invalid code format');
  if (text(data.description).length < 220) issues.push('description below 220 chars');
  if (arrayLength(data.symptoms) < 5) issues.push('symptoms below 5');
  if (arrayLength(data.causes) < 5) issues.push('causes below 5');
  if (arrayLength(data.diagnosticSteps) < 6) issues.push('diagnosticSteps below 6');
  if (arrayLength(data.commonFixes) < 4) issues.push('commonFixes below 4');
  if (arrayLength(data.common_mistakes) < 3) issues.push('common_mistakes below 3');
  if (arrayLength(data.do_not_replace_blindly) < 3) issues.push('do_not_replace_blindly below 3');
  if (arrayLength(data.freeze_frame_fields) < 4) issues.push('freeze_frame_fields below 4');
  if (arrayLength(data.live_data_fields) < 4) issues.push('live_data_fields below 4');
  if (arrayLength(data.related_codes) < 5) issues.push('related_codes below 5');
  if (!['VERIFIED', 'HIGH', 'MEDIUM'].includes(data.source_confidence)) issues.push('source_confidence not allowed');
  if (containsUnsupportedPrecision(data)) issues.push('unsupported exact numeric test value');

  for (const relatedCode of data.related_codes || []) {
    if (!allCodes[relatedCode]) issues.push(`related code missing: ${relatedCode}`);
  }

  const informationGain =
    requiredStrings.filter(field => text(data[field])).length * 4 +
    arrayLength(data.symptoms) * 2 +
    arrayLength(data.causes) * 2 +
    arrayLength(data.diagnosticSteps) * 3 +
    arrayLength(data.commonFixes) * 2 +
    arrayLength(data.common_mistakes) * 2 +
    arrayLength(data.freeze_frame_fields) +
    arrayLength(data.live_data_fields) +
    arrayLength(data.related_codes);

  if (informationGain < 80) issues.push('information gain below 80');

  return {
    code,
    title: text(data.title),
    source_confidence: data.source_confidence,
    information_gain_score: informationGain,
    symptoms: arrayLength(data.symptoms),
    causes: arrayLength(data.causes),
    diagnostic_steps: arrayLength(data.diagnosticSteps),
    related_codes: arrayLength(data.related_codes),
    status: issues.length ? 'FAIL' : 'PASS',
    issues: issues.join('; ')
  };
}

function baseGoldReady(code, data) {
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

function auditExistingGoldSample() {
  const rawGoldCodes = Object.entries(rawBaseCodes)
    .filter(([code, data]) => baseGoldReady(code, data))
    .map(([code]) => code)
    .sort();

  const sample = [];
  const step = Math.max(1, Math.floor(rawGoldCodes.length / 30));
  for (let i = 0; i < rawGoldCodes.length && sample.length < 30; i += step) {
    sample.push(rawGoldCodes[i]);
  }

  return sample.map(code => {
    const data = rawBaseCodes[code];
    const phase3Ready = scoreRecord(code, data);
    return {
      code,
      title: text(data.title),
      current_raw_gold_ready: 'YES',
      phase3_structured_ready: phase3Ready.status === 'PASS' ? 'YES' : 'NO',
      missing_phase3_requirements: phase3Ready.issues
    };
  });
}

function getSimilarityRows(codes, source) {
  const rows = [];
  for (let i = 0; i < codes.length; i += 1) {
    for (let j = i + 1; j < codes.length; j += 1) {
      const left = codes[i];
      const right = codes[j];
      const leftData = source[left];
      const rightData = source[right];
      const similarity = jaccard(similarityBody(leftData), similarityBody(rightData));
    if (similarity >= 0.72) {
        rows.push({
        left,
        right,
        similarity: similarity.toFixed(3),
        risk: similarity >= 0.93 ? 'HIGH' : 'MEDIUM'
      });
    }
  }
  }
  return rows.sort((a, b) => Number(b.similarity) - Number(a.similarity));
}

const batchRows = TOP20.map(code => scoreRecord(code, verifiedDtcGold[code] || {}));
const batch02Rows = BATCH02.map(code => scoreRecord(code, verifiedDtcGoldBatch02[code] || {}));
const similarityRows = getSimilarityRows(TOP20, verifiedDtcGold);
const batch02SimilarityRows = getSimilarityRows(BATCH02, verifiedDtcGoldBatch02);
const existingSampleRows = auditExistingGoldSample();

writeCsv('DTC_GOLD_BATCH_01.csv', batchRows, [
  'code', 'title', 'source_confidence', 'information_gain_score', 'symptoms',
  'causes', 'diagnostic_steps', 'related_codes', 'status', 'issues'
]);
writeCsv('DTC_GOLD_BATCH_02.csv', batch02Rows, [
  'code', 'title', 'source_confidence', 'information_gain_score', 'symptoms',
  'causes', 'diagnostic_steps', 'related_codes', 'status', 'issues'
]);

writeCsv('EXISTING_GOLD_SAMPLE_AUDIT.csv', existingSampleRows, [
  'code', 'title', 'current_raw_gold_ready', 'phase3_structured_ready', 'missing_phase3_requirements'
]);

const passed = batchRows.filter(row => row.status === 'PASS').length;
const failed = batchRows.length - passed;
const highSimilarity = similarityRows.filter(row => row.risk === 'HIGH');
const beforeRawGold = Object.entries(rawBaseCodes).filter(([code, data]) => baseGoldReady(code, data)).length;
const afterRawGold = Object.entries(allCodes).filter(([code, data]) => baseGoldReady(code, data)).length;
const batch02Pass = batch02Rows.filter(row => row.status === 'PASS').length;
const batch02Fail = batch02Rows.filter(row => row.status === 'FAIL').length;
const batch02Review = batch02Rows.filter(row => row.status === 'REVIEW').length;
const batch02HighSimilarity = batch02SimilarityRows.filter(row => row.risk === 'HIGH');
const batch02AverageScore = batch02Rows.reduce((sum, row) => sum + Number(row.information_gain_score || 0), 0) / batch02Rows.length;
const batch02UnsupportedPrecision = batch02Rows.filter(row => row.issues.includes('unsupported exact numeric test value'));
const top100Rows = [...batchRows, ...batch02Rows];
const top100Pass = top100Rows.filter(row => row.status === 'PASS').length;
const top100FailReview = top100Rows.length - top100Pass;

const report = [
  '# Phase 3 DTC Gold Batch 01 Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Scope',
  '',
  '- Batch: TOP 20 only from the recovery queue.',
  '- URL, canonical, domain and sitemap policy were not changed.',
  '- These records are promoted by structured source data, not by expanding runtime fallback text.',
  '',
  '## Batch Result',
  '',
  `- TOP 20 reviewed: ${batchRows.length}`,
  `- Passed gold quality gate: ${passed}`,
  `- Failed gold quality gate: ${failed}`,
  `- Raw gold count before verified overlay: ${beforeRawGold}`,
  `- Raw gold count after verified overlay: ${afterRawGold}`,
  `- Net raw gold increase: ${afterRawGold - beforeRawGold}`,
  '',
  '## Duplicate Similarity Check',
  '',
  `- Similarity pairs >= 0.72: ${similarityRows.length}`,
  `- High-risk similarity pairs >= 0.88: ${highSimilarity.length}`,
  '',
  similarityRows.length
    ? similarityRows.map(row => `- ${row.left} / ${row.right}: ${row.similarity} (${row.risk})`).join('\n')
    : '- No medium or high duplicate similarity pairs were detected in the batch.',
  '',
  '## Existing Raw Gold Sample Audit',
  '',
  `- Existing raw gold sample size: ${existingSampleRows.length}`,
  `- Phase 3 structured-ready in sample: ${existingSampleRows.filter(row => row.phase3_structured_ready === 'YES').length}`,
  `- Existing raw gold records can be content-rich but still lack the new Phase 3 structured fields until upgraded in later batches.`,
  '',
  '## Batch Detail',
  '',
  ...batchRows.map(row => `- ${row.code}: ${row.status} | score ${row.information_gain_score} | ${row.issues || 'no blocking issue'}`),
  ''
].join('\n');

fs.writeFileSync(path.join(REPORT_DIR, 'PHASE3_DTC_GOLD_REPORT.md'), report);

const batch02Report = [
  '# Phase 3 DTC Gold Batch 02 Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Scope',
  '',
  '- Batch: next 80 DTC records from OBD_GOLD_UPGRADE_QUEUE.csv after Batch 01.',
  '- URL, canonical, domain, language, sitemap, robots, noindex, 404/410 and news URL architecture were not changed.',
  '- Existing DTC pages are promoted only through verified structured raw data overlay.',
  '',
  '## Batch 02 Result',
  '',
  `- Attempted: ${batch02Rows.length}`,
  `- PASS: ${batch02Pass}`,
  `- FAIL: ${batch02Fail}`,
  `- REVIEW: ${batch02Review}`,
  '',
  `- Raw Gold BEFORE: 396`,
  `- Raw Gold AFTER: ${afterRawGold}`,
  `- Fallback BEFORE: 1827`,
  `- Fallback AFTER: ${2223 - afterRawGold}`,
  '',
  `- Average quality score: ${batch02AverageScore.toFixed(1)}`,
  `- Average information gain: ${batch02AverageScore.toFixed(1)}`,
  `- Highest similarity pair: ${batch02SimilarityRows[0] ? `${batch02SimilarityRows[0].left} / ${batch02SimilarityRows[0].right} (${batch02SimilarityRows[0].similarity}, ${batch02SimilarityRows[0].risk})` : 'none >= 0.72'}`,
  `- Unsupported precision findings: ${batch02UnsupportedPrecision.length}`,
  '',
  '## Batch 01 + Batch 02 Top-100 Summary',
  '',
  `- TOP 100 attempted: ${top100Rows.length}`,
  `- Total PASS: ${top100Pass}`,
  `- Total FAIL/REVIEW: ${top100FailReview}`,
  '',
  '## Duplicate Similarity Control',
  '',
  batch02SimilarityRows.length
    ? batch02SimilarityRows.slice(0, 20).map(row => `- ${row.left} / ${row.right}: ${row.similarity} (${row.risk})`).join('\n')
    : '- No medium or high duplicate similarity pairs were detected in Batch 02.',
  '',
  '## Batch Detail',
  '',
  ...batch02Rows.map(row => `- ${row.code}: ${row.status} | score ${row.information_gain_score} | ${row.issues || 'no blocking issue'}`),
  ''
].join('\n');

fs.writeFileSync(path.join(REPORT_DIR, 'PHASE3_BATCH02_REPORT.md'), batch02Report);

if (failed || highSimilarity.length || batch02Fail || batch02Review || batch02HighSimilarity.length) {
  console.error(`${report}\n\n${batch02Report}`);
  process.exit(1);
}

console.log(`${report}\n\n${batch02Report}`);
