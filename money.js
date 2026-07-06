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

if (typeof module !== 'undefined') {
  module.exports = { toCents, fmtRM, sameMonth, balanceOf, monthSpent, monthIncome, monthNet };
}
