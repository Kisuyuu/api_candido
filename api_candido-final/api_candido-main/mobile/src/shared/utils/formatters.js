export function formatNumber(value) {
  const n = Number(value) || 0;
  return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function initials(name = '') {
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

/** '2000-05-10' ou '2000-05-10T00:00:00.000000Z' -> '10/05/2000' */
export function isoToBr(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
}

/** '10/05/2000' -> '2000-05-10' (retorna null se inválida) */
export function brToIso(br) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br || '');
  if (!match) return null;
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const valid =
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(m) - 1 &&
    date.getDate() === Number(d);
  return valid ? `${y}-${m}-${d}` : null;
}

export function maskDate(text) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function ageFromIso(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age -= 1;
  return age;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function memberSince(isoDateTime) {
  if (!isoDateTime) return '—';
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return '—';
  return `${MESES[date.getMonth()]}/${date.getFullYear()}`;
}
