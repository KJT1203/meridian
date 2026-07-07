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

function pocketPaid(pocket) {
  return pocket.payments.reduce((s, p) => s + p.amount, 0);
}

function monthlySeries(txns, now, n) { // last n months incl. current: [{label, out, inn}]
  const series = [];
  for (let i = n - 1; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    let out = 0, inn = 0;
    for (const t of txns) {
      if (!sameMonth(t.date, ref)) continue;
      if (t.amount < 0) out -= t.amount; else inn += t.amount;
    }
    series.push({ label: ref.toLocaleDateString('en-GB', { month: 'short' }), out, inn });
  }
  return series;
}

function monthCats(txns, now, top) { // this month's spending by category, desc, top N + Other
  const map = {};
  for (const t of txns) {
    if (t.amount >= 0 || !sameMonth(t.date, now)) continue;
    map[t.cat] = (map[t.cat] || 0) - t.amount;
  }
  const rows = Object.entries(map).map(([cat, total]) => ({ cat, total })).sort((a, b) => b.total - a.total);
  if (top && rows.length > top) {
    const rest = rows.slice(top).reduce((s, r) => s + r.total, 0);
    rows.length = top;
    rows.push({ cat: 'Other', total: rest });
  }
  return rows;
}

function dueDates(rule, now) { // months after rule.lastRun whose scheduled day has passed -> ISO dates
  const out = [];
  let [y, m] = rule.lastRun.split('-').map(Number);
  for (;;) {
    m++; if (m > 12) { m = 1; y++; }
    if (y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth() + 1)) break;
    const dim = new Date(y, m, 0).getDate();
    const day = Math.min(rule.day, dim); // Jan 31 rule -> Feb 28
    if (new Date(y, m - 1, day) <= now) {
      out.push(`${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
  }
  return out;
}

function daysSinceLastTxn(txns, now) {
  if (!txns.length) return null;
  const latest = txns.reduce((m, t) => t.date > m ? t.date : m, txns[0].date);
  const [y, mo, d] = latest.split('-').map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - new Date(y, mo - 1, d)) / 86400000);
}

function csvField(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function statementCSV(accounts, txns) { // bank-style statement, opens directly in Excel
  const rows = [['Date', 'Account', 'Category', 'Note', 'Money In (RM)', 'Money Out (RM)', 'Balance (RM)']];
  const names = Object.fromEntries(accounts.map(a => [a.id, a.name]));
  let bal = accounts.reduce((s, a) => s + a.start, 0);
  rows.push(['', '', 'Opening balance', '', '', '', (bal / 100).toFixed(2)]);
  for (const t of [...txns].sort((x, y) => x.date.localeCompare(y.date) || x.id.localeCompare(y.id))) {
    bal += t.amount;
    rows.push([
      t.date, names[t.acc] || '', t.cat, t.note || '',
      t.amount > 0 ? (t.amount / 100).toFixed(2) : '',
      t.amount < 0 ? (-t.amount / 100).toFixed(2) : '',
      (bal / 100).toFixed(2),
    ]);
  }
  return rows.map(r => r.map(csvField).join(',')).join('\r\n');
}

if (typeof module !== 'undefined') {
  module.exports = { toCents, fmtRM, sameMonth, balanceOf, monthSpent, monthIncome, monthNet, dayTotals, fmtShort, pocketPaid, statementCSV, monthlySeries, monthCats, dueDates, daysSinceLastTxn };
}
