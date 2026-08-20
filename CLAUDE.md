# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repository contains one self-contained HTML report (a client-side dashboard that compares global AI Coding Plan / Token Plan pricing across 16 vendors and 60+ subscription tiers):

- **`coding-plan-report.html`** — the single merged report. It supports **light/dark theme switching** via an AIHOT-style segmented slider in the sidebar「外观」(深色 / 跟随系统 / 浅色), implemented the same way as the AIHOT site (`aihot.virxact.com`): `<html data-theme="light|dark">` + two sets of CSS variables + `localStorage['aihot-theme']`, default `auto` follows `prefers-color-scheme`. Verified working in a real browser (chrome-devtools-mcp): clicking each option flips `data-theme`/body background and slides the `.theme-toggle-thumb`; the choice survives reload (head script applies it before paint).

The file is fully self-contained (CSS, data, and vanilla JS in one file) with no build system, package manager, or server.

## Common commands

There are no build, lint, or test scripts. Useful operations:

- **View the report**: open `coding-plan-report.html` in a browser (light/dark switches live in the left sidebar).
- **Validate the embedded JavaScript syntax** (requires extracting the `<script>` block; there are two — the small theme-init block in `<head>` and the main app block in `<body>`):
  ```bash
  node --check <(sed -n '/<script>/,/<\/script>/p' coding-plan-report.html | sed 's/<\/?script>//g')
  ```
  Or copy the script content into a temporary `.js` file and run `node --check tmp.js`.
- **Smoke test the rendering logic**: the memory note `.workbuddy/memory/2026-08-20.md` mentions a Node-based smoke test that mocks `getElementById` / `querySelector` / `classList` / `CSS.escape` and runs the full render path. There is no persisted test harness in the repo; recreate it from that note if needed.

## Architecture

- **Single-file static app**: `coding-plan-report.html` bundles CSS, data, and vanilla JS. It has no external dependencies.
- **Theme system** (merged from the former two files — light edition + AIHOT dark edition):
  - `:root` defines the **dark** palette (AIHOT skin) and `:root[data-theme="light"]` overrides it (original light skin).
  - All component styles must reference **variables only** — no hard-coded colors — so both palettes work. Component semantic variables live at the bottom of each palette (e.g. `--header-bg`, `--th-bg`, `--filter-active-bg`, `--ref-bg`, `--muted`).
  - Theme init runs twice: a tiny in-`<head>` script (avoids flash-of-wrong-theme, sets `data-theme`/`data-theme-mode` on `<html>` before paint) and the interactive `applyTheme()` in the body script. It binds `#themeSwitch` via **event delegation** on the `.theme-toggle-opt` buttons (AIHOT-style segmented slider with a `.theme-toggle-thumb` whose `data-pos` matches `dark`/`auto`/`light`), persists to `localStorage['aihot-theme']`, and watches `prefers-color-scheme` changes in auto mode (with `addListener` fallback for older browsers).
  - JS template strings occasionally reference variables (e.g. `var(--good-soft)` for the best-row background, `var(--ref-bg)` for the API-payg row, `var(--warn)` for promo text); keep those variable-based when editing.
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
  - Navigation is driven by the left sidebar (`data-tab` links → `switchTab`); there is no top nav bar. The sidebar also hosts the region filter (全部/仅国内/仅国外) and the theme switch (自动/浅色/深色). There are **no in-tab region filter buttons** — they were removed because the sidebar covers it; `applyRegion` is driven solely by `#sidebarRegion`.
  - `switchTab` toggles the `side-link-active` class on sidebar links (CSS class name — do not revert to a generic `active` class, that was the old highlighter bug).
  - `renderRank` sorts `allPlans` by `planCost` and draws a logarithmic comparison bar.
  - `renderCompany` groups models into "strong" vs. "base" chips using `strongModels` set and the heuristic `m.r >= 1.5`.
  - `showModel` computes per-model effective cost (`tokensM / rate`) and ranks supporting subscriptions.
- **Exclusions from ranking**: OpenCode Zen (`payg: true`) and free tiers (`tokensM: 0`, e.g. CodeBuddy Free) are intentionally kept out of `allPlans` to avoid `NaN` costs, but they still appear in the vendor cards because `renderCompany` iterates `c.plans` directly.

## Data maintenance conventions

- Keep the report self-contained: add new vendors/plans/models by editing the JS arrays inside the HTML file.
- Do not hard-code derived totals (vendor count, plan count) in the subtitle or stat strip; the code already computes them from the data.
- When adding a new strong/flagship model, also add it to `strongModels` so it renders in the top chip group on company cards.
- Verify that any newly added plan has either a positive `tokensM` or is explicitly marked `payg: true` / `price: 0`, otherwise ranking calculations may produce `NaN`.
- When adding new UI chrome, keep colors variable-based so both light and dark palettes stay consistent; check both themes in the browser afterward.

## Memory

Project context and a detailed changelog are recorded in `.workbuddy/memory/2026-08-20.md`, including data sources, key assumptions, and recent fixes.