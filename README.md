# Playwright mobile-web Fixing demo

Two simple groups, five tests total:
- Cards (3): freeze, unfreeze, frozen state after navigation. In `pages/BankPage.js`, shared typo: `freeze-card-old` instead of `freeze-card`.
- Home balances (2): total balance €18,950.80 and everyday account balance €6,450.80. In separate `pages/HomePage.js`, shared typo: `screen-home-old` instead of `screen-home`.

In AmbientQA: New session, Refresh tests, Inspect, then Fix. Complete only when all five tests pass and the full suite is verified.

Reset: `python3 /Users/nklars0/Projects/demo_preparation/reset-demos.py demo_fixing`.

Chromium mobile viewport 390×844, one worker, zero retries. The shared banking app runs on port 4174.
