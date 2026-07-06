// run: node test.js
const assert = require('assert');
const { parseDate, spanProgress, dayBounds, weekBounds, monthBounds, yearBounds, remainingText } = require('./progress.js');
const { toCents, fmtRM, balanceOf, monthSpent, monthIncome, monthNet, dayTotals, fmtShort } = require('./money.js');

// ---- progress.js ----
const noon = new Date(2026, 6, 6, 12, 0, 0); // Monday 6 July 2026, 12:00

assert.strictEqual(spanProgress(...dayBounds(noon), noon), 0.5);

const [ws, we] = weekBounds(noon);
assert.strictEqual(ws.getDay(), 1); // Monday
assert.strictEqual((we - ws) / 86400000, 7);

const [ms, me] = monthBounds(noon);
assert.strictEqual(ms.getDate(), 1);
assert.strictEqual(me.getMonth(), 7);

const [ys, ye] = yearBounds(noon);
assert.strictEqual((ye - ys) / 86400000, 365); // 2026 is not a leap year

assert.strictEqual(spanProgress(parseDate('2026-01-01'), parseDate('2026-01-11'), parseDate('2026-01-06')), 0.5);
assert.strictEqual(spanProgress(parseDate('2026-01-01'), parseDate('2026-01-02'), parseDate('2026-03-01')), 1); // clamped
assert.strictEqual(spanProgress(parseDate('2026-06-01'), parseDate('2026-06-02'), parseDate('2026-01-01')), 0); // clamped

assert.strictEqual(remainingText(-5), 'concluded');
assert.strictEqual(remainingText(30000), 'moments away');
assert.strictEqual(remainingText(45 * 60000), '45 minutes remaining');
assert.strictEqual(remainingText(25 * 3600000), '25 hours remaining');
assert.strictEqual(remainingText(3 * 86400000), '3 days remaining');
assert.strictEqual(remainingText(400 * 86400000), '1 year, 35 days remaining');

// ---- money.js ----
assert.strictEqual(toCents('12.50'), 1250);
assert.strictEqual(toCents('0.1'), 10);
assert.strictEqual(toCents('1000'), 100000);
assert(Number.isNaN(toCents('abc')));
assert.strictEqual(fmtRM(123456), 'RM 1,234.56');
assert.strictEqual(fmtRM(-500), '-RM 5.00');

const txns = [
  { id: '1', acc: 'a', amount: -1200, cat: 'Food', date: '2026-07-03' },
  { id: '2', acc: 'a', amount: -800, cat: 'food', date: '2026-07-05' }, // case-insensitive match
  { id: '3', acc: 'b', amount: 300000, cat: 'Income', date: '2026-07-01' },
  { id: '4', acc: 'a', amount: -5000, cat: 'Food', date: '2026-06-20' }, // last month
];
const july = new Date(2026, 6, 6);

assert.strictEqual(balanceOf({ id: 'a', start: 10000 }, txns), 10000 - 1200 - 800 - 5000);
assert.strictEqual(balanceOf({ id: 'b', start: 0 }, txns), 300000);
assert.strictEqual(monthSpent(txns, july), 2000);
assert.strictEqual(monthSpent(txns, july, 'Food'), 2000);
assert.strictEqual(monthSpent(txns, july, 'Rent'), 0);
assert.strictEqual(monthIncome(txns, july), 300000);
assert.strictEqual(monthNet(txns, july, 'a'), -2000);
assert.strictEqual(monthNet(txns, july), 298000);

assert.deepStrictEqual(dayTotals(txns, 2026, 6), {
  1: { out: 0, inn: 300000 },
  3: { out: 1200, inn: 0 },
  5: { out: 800, inn: 0 },
});
assert.strictEqual(fmtShort(1250), '12.50');
assert.strictEqual(fmtShort(5000), '50');
assert.strictEqual(fmtShort(300000), '3k');
assert.strictEqual(fmtShort(123456), '1.2k');

console.log('all checks passed');
