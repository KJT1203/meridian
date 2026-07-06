// Meridian — money math (pure, shared by index.html and test.js)
// Amounts are integer cents; expenses negative, income positive.

function toCents(str) {
  const v = Math.round(parseFloat(str) * 100);
  return Number.isFinite(v) ? v : NaN;
}

function fmtRM(cents) {
  const sign = cents < 0 ? '-' : '';
  const v = Math.abs(cents) / 100;
  return sign + 'RM ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sameMonth(dateStr, now) { // dateStr 'YYYY-MM-DD'
  const [y, m] = dateStr.split('-').map(Number);
  return y === now.getFullYear() && m === now.getMonth() + 1;
}

function balanceOf(acc, txns) {
  return txns.reduce((s, t) => t.acc === acc.id ? s + t.amount : s, acc.start);
}

function monthSpent(txns, now, cat) {
  return txns.reduce((s, t) => {
    if (t.amount >= 0 || !sameMonth(t.date, now)) return s;
    if (cat && t.cat.toLowerCase() !== cat.toLowerCase()) return s;
    return s - t.amount;
  }, 0);
}

function monthIncome(txns, now) {
  return txns.reduce((s, t) => (t.amount > 0 && sameMonth(t.date, now)) ? s + t.amount : s, 0);
}

function monthNet(txns, now, accId) {
  return txns.reduce((s, t) => (sameMonth(t.date, now) && (!accId || t.acc === accId)) ? s + t.amount : s, 0);
}

function dayTotals(txns, y, m0) { // m0 0-based month -> { day: {out, inn} }
  const map = {};
  for (const t of txns) {
    const [ty, tm, td] = t.date.split('-').map(Number);
    if (ty !== y || tm !== m0 + 1) continue;
    const d = map[td] || (map[td] = { out: 0, inn: 0 });
    if (t.amount < 0) d.out -= t.amount; else d.inn += t.amount;
  }
  return map;
}

function fmtShort(cents) { // compact amount for calendar cells, no "RM"
  const v = cents / 100;
  if (v >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return v % 1 ? v.toFixed(2) : String(v);
}

if (typeof module !== 'undefined') {
  module.exports = { toCents, fmtRM, sameMonth, balanceOf, monthSpent, monthIncome, monthNet, dayTotals, fmtShort };
}
