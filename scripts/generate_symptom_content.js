/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const OUTPUT = process.env.OUTPUT || path.join('src', 'data', 'generated', 'symptom-content', 'content.json');
const ROUTES_OUTPUT = process.env.ROUTES_OUTPUT || path.join('src', 'data', 'generated', 'symptom-content', 'routes.json');
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const API_KEY = process.env.OPENAI_API_KEY || '';
const LIMIT = Math.max(1, Number.parseInt(process.env.LIMIT || '30', 10));
const DRY_RUN = process.env.DRY_RUN === '1';

const LOCALES = ['en', 'tr', 'de', 'es', 'fr'];
const VEHICLES = ['renault', 'bmw', 'volkswagen', 'ford-focus', 'fiat-egea', 'opel-astra', 'peugeot', 'toyota-corolla', 'honda-civic', 'hyundai-i20', 'renault-clio', 'renault-megane', 'bmw-3-series', 'volkswagen-golf', 'ford-fiesta', 'opel-corsa', 'peugeot-308', 'toyota-yaris', 'honda-jazz', 'hyundai-accent'];
const SYMPTOMS = [
  ['loss_of_power', 'gaz yemiyor'],
  ['engine_noise', 'motordan ses geliyor'],
  ['rough_idle', 'rölanti dalgalanıyor'],
  ['engine_shaking', 'titriyor'],
  ['check_engine_light', 'motor arıza lambası yanıyor'],
  ['hard_start', 'geç çalışıyor'],
  ['black_smoke', 'siyah duman atıyor'],
  ['white_smoke', 'beyaz duman atıyor'],
  ['poor_fuel_economy', 'çok yakıyor'],
  ['stalling', 'stop ediyor'],
  ['jerking', 'silkeleme yapıyor'],
  ['overheating', 'hararet yapıyor'],
  ['fuel_smell', 'benzin kokusu geliyor'],
  ['oil_smell', 'yanık yağ kokusu geliyor'],
  ['transmission_slipping', 'vites kaçırıyor'],
];

const INTRO_EXPANSIONS = {
  en: 'This guide focuses on the safest first checks, the OBD2 codes commonly seen with this symptom, and the tests that help separate a sensor fault from a wiring, fuel, ignition, air intake, cooling, exhaust, or transmission problem before any expensive parts are replaced.',
  tr: 'Bu rehber pahalı parça değişimine geçmeden önce yapılması gereken güvenli ilk kontrolleri, bu belirtiyle birlikte sık görülen OBD2 kodlarını ve arızanın sensör, tesisat, yakıt, ateşleme, hava emiş, soğutma, egzoz veya şanzıman kaynaklı olup olmadığını ayırmaya yarayan test sırasını anlatır.',
  de: 'Dieser Leitfaden konzentriert sich auf sichere Erstprüfungen, häufig passende OBD2-Codes und eine sinnvolle Testreihenfolge, damit Sensorfehler, Verkabelung, Kraftstoffversorgung, Zündung, Ansaugung, Kühlung, Abgasstrang oder Getriebe getrennt bewertet werden können, bevor teure Teile ersetzt werden.',
  es: 'Esta guía prioriza las primeras comprobaciones seguras, los códigos OBD2 que suelen aparecer con este síntoma y una secuencia de diagnóstico que ayuda a diferenciar sensores, cableado, combustible, encendido, admisión, refrigeración, escape o transmisión antes de cambiar piezas costosas.',
  fr: 'Ce guide met l’accent sur les premiers contrôles sûrs, les codes OBD2 souvent associés à ce symptôme et une méthode de diagnostic qui aide à distinguer capteur, faisceau, carburant, allumage, admission, refroidissement, échappement ou transmission avant de remplacer des pièces coûteuses.',
};

const META_EXPANSIONS = {
  en: ' Step-by-step checks, common OBD2 codes and repair priorities.',
  tr: ' İlk kontroller, olası OBD2 kodları ve doğru teşhis sırası.',
  de: ' Erste Prüfungen, typische OBD2-Codes und klare Diagnosefolge.',
  es: ' Primeras revisiones, códigos OBD2 frecuentes y diagnóstico claro.',
  fr: ' Premiers contrôles, codes OBD2 fréquents et ordre de diagnostic.',
};

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readExisting() {
  if (!fs.existsSync(OUTPUT)) return [];
  return JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeRoutes(records) {
  const routes = records
    .filter(record => record.status === 'published' && LOCALES.every(locale => record.locales?.[locale]?.slug))
    .map(record => ({
      contentGroupId: record.contentGroupId,
      slugs: Object.fromEntries(LOCALES.map(locale => [locale, record.locales[locale].slug])),
    }));
  writeJson(ROUTES_OUTPUT, routes);
}

function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function trimToMetaLength(text) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= 180) return value;
  const trimmed = value.slice(0, 177).replace(/\s+\S*$/, '');
  return `${trimmed || value.slice(0, 177)}...`;
}

function completeLocaleQuality(item, locale) {
  if (!item) return item;
  if (wordCount(item.intro) < 35) {
    item.intro = `${String(item.intro || '').trim()} ${INTRO_EXPANSIONS[locale]}`.trim();
  }
  if (!item.metaDescription || item.metaDescription.length < 80) {
    item.metaDescription = `${String(item.metaDescription || item.title || '').trim()}${META_EXPANSIONS[locale]}`.trim();
  }
  item.metaDescription = trimToMetaLength(item.metaDescription);
  if (!item.schemaTitle) item.schemaTitle = item.title;
  if (!item.schemaDescription) item.schemaDescription = item.metaDescription;
  return item;
}

function buildKeywordQueue(existing) {
  const used = new Set(existing.map(item => item.intentKey));
  const queue = [];
  for (const vehicle of VEHICLES) {
    for (const [symptom, phrase] of SYMPTOMS) {
      const vehicleLabel = vehicle.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      const intentKey = `${vehicle}_${symptom}`;
      if (!used.has(intentKey)) queue.push({ vehicle, symptom, keyword: `${vehicleLabel} ${phrase}`, intentKey });
    }
  }
  return queue.slice(0, LIMIT);
}

function buildPrompt(seed) {
  return `
You are creating SEO-safe, expert-style automotive diagnostic content for OBD2HQ.

Create one content group in valid JSON only. It must contain 5 locales: en, tr, de, es, fr.
The search intent starts from Turkish but each language must be natural for that locale, not literal translation.

Seed:
- vehicle/make/model phrase: ${seed.vehicle}
- symptom key: ${seed.symptom}
- Turkish query: ${seed.keyword}
- intentKey: ${seed.intentKey}

Rules:
- Do not claim a single certain cause.
- Do not invent model-specific factory recalls.
- Give practical checks before replacing parts.
- Write intro as at least 45 words in every locale.
- Write metaDescription between 80 and 180 characters in every locale.
- Include at least 5 likely causes, 6 diagnostic steps, 3 first checks, 3 common mistakes, 3 related OBD2 codes, 3 internal links and 3 FAQ items per locale.
- Internal links must use locale-prefixed OBD2HQ paths.
- Keep slugs ASCII lower-case with hyphens.
- Status must be "published" only if all five locales are complete.
- qualityScore must be 80-100.

Return exactly this JSON shape:
{
  "contentGroupId": "ascii-id",
  "intentKey": "${seed.intentKey}",
  "make": "Renault",
  "model": null,
  "symptomKey": "${seed.symptom}",
  "qualityScore": 90,
  "status": "published",
  "locales": {
    "en": {"slug":"","title":"","metaDescription":"","intro":"","severity":"","driveAdvice":"","likelyCauses":[],"diagnosticSteps":[],"firstChecks":[],"commonMistakes":[],"relatedCodes":[],"internalLinks":[{"label":"","href":""}],"faq":[{"q":"","a":""}],"schemaTitle":"","schemaDescription":""},
    "tr": {"slug":"","title":"","metaDescription":"","intro":"","severity":"","driveAdvice":"","likelyCauses":[],"diagnosticSteps":[],"firstChecks":[],"commonMistakes":[],"relatedCodes":[],"internalLinks":[{"label":"","href":""}],"faq":[{"q":"","a":""}],"schemaTitle":"","schemaDescription":""},
    "de": {"slug":"","title":"","metaDescription":"","intro":"","severity":"","driveAdvice":"","likelyCauses":[],"diagnosticSteps":[],"firstChecks":[],"commonMistakes":[],"relatedCodes":[],"internalLinks":[{"label":"","href":""}],"faq":[{"q":"","a":""}],"schemaTitle":"","schemaDescription":""},
    "es": {"slug":"","title":"","metaDescription":"","intro":"","severity":"","driveAdvice":"","likelyCauses":[],"diagnosticSteps":[],"firstChecks":[],"commonMistakes":[],"relatedCodes":[],"internalLinks":[{"label":"","href":""}],"faq":[{"q":"","a":""}],"schemaTitle":"","schemaDescription":""},
    "fr": {"slug":"","title":"","metaDescription":"","intro":"","severity":"","driveAdvice":"","likelyCauses":[],"diagnosticSteps":[],"firstChecks":[],"commonMistakes":[],"relatedCodes":[],"internalLinks":[{"label":"","href":""}],"faq":[{"q":"","a":""}],"schemaTitle":"","schemaDescription":""}
  }
}`;
}

async function callOpenAI(seed) {
  if (!API_KEY) throw new Error('OPENAI_API_KEY is required. Add it as a GitHub/Vercel secret or .env variable.');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input: buildPrompt(seed),
      text: { format: { type: 'json_object' } },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const text = data.output_text || data.output?.flatMap(item => item.content || []).map(item => item.text || '').join('') || '';
  return normalizeRecord(JSON.parse(text), seed);
}

function normalizeRecord(record, seed) {
  record.intentKey = seed.intentKey;
  record.contentGroupId = record.contentGroupId || slugify(seed.intentKey);
  record.symptomKey = seed.symptom;
  for (const locale of LOCALES) completeLocaleQuality(record.locales?.[locale], locale);
  record.status = LOCALES.every(locale => record.locales?.[locale]?.slug) ? 'published' : 'needs_review';
  record.qualityScore = Math.max(0, Math.min(100, Number(record.qualityScore || 80)));
  return record;
}

async function main() {
  const existing = readExisting();
  const queue = buildKeywordQueue(existing);
  if (queue.length === 0) {
    console.log('No new symptom keyword seeds available.');
    return;
  }
  if (DRY_RUN) {
    console.log(JSON.stringify(queue, null, 2));
    return;
  }

  const byId = new Map(existing.map(item => [item.contentGroupId, item]));
  for (const seed of queue) {
    console.log(`Generating ${seed.keyword}`);
    const record = await callOpenAI(seed);
    byId.set(record.contentGroupId, record);
    const records = Array.from(byId.values());
    writeJson(OUTPUT, records);
    writeRoutes(records);
  }
  console.log(`Saved ${OUTPUT}. Total groups: ${byId.size}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
