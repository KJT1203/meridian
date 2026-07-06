// Meridian — pure date math, shared by index.html and test.js

function parseDate(str) { // 'YYYY-MM-DD' -> local midnight (new Date(str) would be UTC)
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function spanProgress(start, end, now) {
  return Math.max(0, Math.min(1, (now - start) / (end - start)));
}

function dayBounds(now) {
  const s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const e = new Date(s); e.setDate(e.getDate() + 1);
  return [s, e];
}

function weekBounds(now) { // weeks begin Monday
  const s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  s.setDate(s.getDate() - (s.getDay() + 6) % 7);
  const e = new Date(s); e.setDate(e.getDate() + 7);
  return [s, e];
}

function monthBounds(now) {
  return [new Date(now.getFullYear(), now.getMonth(), 1),
          new Date(now.getFullYear(), now.getMonth() + 1, 1)];
}

function yearBounds(now) {
  return [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear() + 1, 0, 1)];
}

function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

function remainingText(ms) {
  if (ms <= 0) return 'concluded';
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'moments away';
  if (min < 60) return plural(min, 'minute') + ' remaining';
  const hrs = Math.floor(ms / 3600000);
  if (hrs < 48) {
    const m = Math.floor((ms % 3600000) / 60000);
    return plural(hrs, 'hour') + (m ? ', ' + plural(m, 'minute') : '') + ' remaining';
  }
  const days = Math.floor(ms / 86400000);
  if (days < 365) return plural(days, 'day') + ' remaining';
  // ponytail: 365-day years, close enough for a countdown label
  const yrs = Math.floor(days / 365), rem = days % 365;
  return plural(yrs, 'year') + (rem ? ', ' + plural(rem, 'day') : '') + ' remaining';
}

if (typeof module !== 'undefined') {
  module.exports = { parseDate, spanProgress, dayBounds, weekBounds, monthBounds, yearBounds, remainingText };
}
