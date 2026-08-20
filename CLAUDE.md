# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repository contains two self-contained HTML reports (client-side dashboards that compare global AI Coding Plan / Token Plan pricing across 16 vendors and 60+ subscription tiers):

- **`coding-plan-report.html`** — the working light-theme report.
- **`coding-plan-report-aihot.html`** — a copy whose entire UI is restyled to match the AIHOT dark theme (see `aihot.virxact.com`; dark `#10151c` page, teal `#4fa3b3` accent, dark sidebar).

Both are fully self-contained (CSS, data, and vanilla JS in one file) with no build system, package manager, or server. They share the same data arrays and JS; only the `<style>` block differs between the two. When editing data/JS, apply changes to **both** files (the copy was created with `cp`, so they diverge if only one is edited).

## Common commands

There are no build, lint, or test scripts. Useful operations:

- **View the report**: open `coding-plan-report.html` in a browser.
- **Validate the embedded JavaScript syntax** (requires extracting the `<script>` block):
  ```bash
  node --check <(sed -n '/<script>/,/<\/script>/p' coding-plan-report.html | sed 's/<\/?script>//g')
  ```
  Or copy the script content into a temporary `.js` file and run `node --check tmp.js`.
- **Smoke test the rendering logic**: the memory note `.workbuddy/memory/2026-08-20.md` mentions a Node-based smoke test that mocks `getElementById` / `querySelector` / `classList` / `CSS.escape` and runs the full render path. There is no persisted test harness in the repo; recreate it from that note if needed.

## Architecture

- **Single-file static app**: `coding-plan-report.html` bundles CSS, data, and vanilla JS. It has no external dependencies.
- **Data model**:
  - `companies[]` — each vendor has metadata (`region`, `url`, `desc`) and `plans[]`.
  - Each plan has `price`, `cur` (`'CNY'` | `'USD'`), `tokensM` (estimated monthly tokens in millions), `models[]`, plus optional `promo`, `annual`, `tag`, and `payg`.
  - Each model entry is `{ n: name, r: consumptionRate, tag? }`.
  - `apiRefs[]` stores API pay-as-you-go reference prices for the model-query tab.
- **Core calculations**:
  - `FX = 7.1` fixed USD→CNY rate.
  - `planPriceCNY(p)` normalizes plan price to CNY.
  - `planCost(p)` = `planPriceCNY(p) / tokensM`, giving cost per million tokens.
  - `allPlans` is built by flattening `companies[].plans` while excluding `payg` plans and plans with `tokensM === 0` (free tiers), so ranking and stats never divide by zero.
  - Display currency is fixed to CNY (`dispMoney` / `dispCost` / `costUnit`); the CNY↔USD toggle was removed. `FX` is still used to convert USD-denominated plan prices to CNY for comparison.
- **Rendering**:
  - Four tabs: ranking by cost, vendor cards, model query, and methodology.
  - Navigation is driven by the left sidebar (`data-tab` links → `switchTab`); there is no top nav bar. A region filter (`applyRegion`) is shared across the sidebar and the in-tab filters.
  - `renderRank` sorts `allPlans` by `planCost` and draws a logarithmic comparison bar.
  - `renderCompany` groups models into "strong" vs. "base" chips using `strongModels` set and the heuristic `m.r >= 1.5`.
  - `showModel` computes per-model effective cost (`tokensM / rate`) and ranks supporting subscriptions.
- **Exclusions from ranking**: OpenCode Zen (`payg: true`) and free tiers (`tokensM: 0`, e.g. CodeBuddy Free) are intentionally kept out of `allPlans` to avoid `NaN` costs, but they still appear in the vendor cards because `renderCompany` iterates `c.plans` directly.

## Data maintenance conventions

- Keep the report self-contained: add new vendors/plans/models by editing the JS arrays inside the HTML files. Apply the change to **both** `coding-plan-report.html` and `coding-plan-report-aihot.html` to keep them in sync.
- Do not hard-code derived totals (vendor count, plan count) in the subtitle or stat strip; the code already computes them from the data.
- When adding a new strong/flagship model, also add it to `strongModels` so it renders in the top chip group on company cards.
- Verify that any newly added plan has either a positive `tokensM` or is explicitly marked `payg: true` / `price: 0`, otherwise ranking calculations may produce `NaN`.

## Memory

Project context and a detailed changelog are recorded in `.workbuddy/memory/2026-08-20.md`, including data sources, key assumptions, and recent fixes.
