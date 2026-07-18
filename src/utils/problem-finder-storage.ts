const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(?:\+?\d[\s().-]*){9,}/;
const VIN_RE = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
const PLATE_RE = /\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/i;

export function sanitizeProblemQuery(input: unknown) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim().slice(0, 180);
  if (trimmed.length < 2) return null;
  if (EMAIL_RE.test(trimmed) || PHONE_RE.test(trimmed) || VIN_RE.test(trimmed) || PLATE_RE.test(trimmed)) {
    return null;
  }
  return trimmed.replace(/\s+/g, ' ');
}

export function isLikelySpam(input: string) {
  const normalized = input.toLowerCase();
  if (/(casino|porn|viagra|loan|crypto|telegram|whatsapp|http:\/\/|https:\/\/)/i.test(normalized)) return true;
  const repeated = normalized.match(/(.)\1{8,}/);
  return Boolean(repeated);
}

export async function pushOptionalKvList(key: string, payload: unknown) {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) return { stored: false };

  const value = encodeURIComponent(JSON.stringify(payload));
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/lpush/${encodeURIComponent(key)}/${value}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!response.ok) return { stored: false };

  await fetch(`${baseUrl.replace(/\/$/, '')}/ltrim/${encodeURIComponent(key)}/0/4999`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  }).catch(() => undefined);

  return { stored: true };
}
