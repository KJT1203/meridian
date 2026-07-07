# Meridian

*time & money, measured beautifully*

**[Open the live app →](https://kjt1203.github.io/meridian/)**

A clean, Apple-style tracker for the two things that run out: time and money. Inspired by Pretty Progress, extended into a hybrid dashboard — porcelain surface, white cards, jade accent.

**Time** — live progress of today, this week, this month, this year, plus your own milestones ("Graduation", "Internship begins") counting down with bars, rings, or a hundred dots.

**Money** — a lightweight money manager in the same language: monthly budgets rendered exactly like milestones (a budget is just progress through money instead of time), accounts with live balances, a transaction log with a day-by-day spending calendar, and **pockets** — money set aside toward a target, like a RM 6,000 instalment plan paid RM 200 at a time, or saving up for a PC.

**Account** — a local profile with an optional PIN (hashed, device-only — not real multi-device auth), plus a summary dashboard aggregating stats from everything: milestones, balances, monthly flow, pockets.

- Plain HTML/CSS/JS — no build, no dependencies
- **Installable PWA** — Add to Home Screen on Android, works offline
- Everything persists in localStorage, with one-file **Back Up / Restore** (Account tab)
- Statement export (CSV for Excel), money-flow and category charts
- Pocket payments can mirror as account expenses, so balances stay true
- Three card styles (bar / ring / dots), four tones (jade / sky / amber / plum)
- Live clock, one-second updates

## Run

Use it live at [kjt1203.github.io/meridian](https://kjt1203.github.io/meridian/), or run locally: open `index.html` in a browser, or serve the folder with any static server.

## Checks

```
node test.js
```
