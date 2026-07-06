// run: node test.js
const assert = require('assert');
const { parseDate, spanProgress, dayBounds, weekBounds, monthBounds, yearBounds, remainingText } = require('./progress.js');

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

console.log('all checks passed');
