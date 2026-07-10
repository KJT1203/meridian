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

// Countdown wording is template-driven so the app can localize it; English is the default.
let RT = {
  concluded: 'concluded',
  moments: 'moments away',
  remaining: '{x} remaining',
  joiner: ', ',
  minute: ['{n} minute', '{n} minutes'],
  hour: ['{n} hour', '{n} hours'],
  day: ['{n} day', '{n} days'],
  year: ['{n} year', '{n} years'],
};
function setTimeStrings(s) { RT = Object.assign({}, RT, s); }
function unitText(n, key) { return RT[key][n === 1 ? 0 : 1].replace('{n}', n); }

function remainingText(ms) {
  if (ms <= 0) return RT.concluded;
  const min = Math.floor(ms / 60000);
  if (min < 1) return RT.moments;
  let x;
  if (min < 60) {
    x = unitText(min, 'minute');
  } else {
    const hrs = Math.floor(ms / 3600000);
    if (hrs < 48) {
      const m = Math.floor((ms % 3600000) / 60000);
      x = unitText(hrs, 'hour') + (m ? RT.joiner + unitText(m, 'minute') : '');
    } else {
      const days = Math.floor(ms / 86400000);
      if (days < 365) {
        x = unitText(days, 'day');
      } else {
        // ponytail: 365-day years, close enough for a countdown label
        const yrs = Math.floor(days / 365), rem = days % 365;
        x = unitText(yrs, 'year') + (rem ? RT.joiner + unitText(rem, 'day') : '');
      }
    }
  }
  return RT.remaining.replace('{x}', x);
}

if (typeof module !== 'undefined') {
  module.exports = { parseDate, spanProgress, dayBounds, weekBounds, monthBounds, yearBounds, remainingText, setTimeStrings };
}
