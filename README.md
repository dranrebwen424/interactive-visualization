# Anxiety Study Interactive Dashboard

Interactive data dashboard built with **React + Vite + Tailwind CSS + GSAP**.

## Information architecture (implemented)

1. **Global control band**
   - Filters: strand, sex
   - Toggles: subgroup comparison, predictor variable, anxiety dimension

2. **Visualization workspace (2x2 responsive grid)**
   - Interactive bar comparison for means (predictors + anxiety dimensions) with subgroup comparison
   - Correlation heatmap (predictor vs anxiety dimensions) with legend and hover values
   - Scatter plot for selected predictor and anxiety dimension
   - Conceptual framework network map with hover details and zoom/pan

3. **Contextual raw data drawer**
   - Opens on click from bar, heatmap cell, scatter point, or network node
   - Shows only matching raw rows under active filters + click selection
   - CSV export button

## Component structure and data flow

- `src/App.jsx`
  - Owns raw data, global filters, filtered dataset, loading/error/empty states
  - Holds single `handleInspect` drilldown method used by all charts
- `src/components/GlobalControls.jsx`
  - Updates global filter state
- `src/components/InteractiveBarChart.jsx`
  - Receives filtered rows and subgroup key
  - Computes means and emits drilldown selection
- `src/components/CorrelationHeatmap.jsx`
  - Computes Pearson correlation matrix on filtered rows
- `src/components/ScatterPlot.jsx`
  - Displays row-level points for selected predictor/anxiety dimension
- `src/components/ConceptualFramework.jsx`
  - Shows network nodes/edges and theory links with zoom/pan
- `src/components/RawDataDrawer.jsx`
  - Displays selected rows and exports CSV
- `src/data/sampleData.js`
  - Sample dataset generator + variable metadata
- `src/utils/stats.js`
  - Reusable filtering, mean, correlation, CSV helpers

### Data flow summary

`sampleData -> App state -> filteredRows -> chart props -> click selection -> handleInspect -> RawDataDrawer`

## Setup / run

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
npm run preview
```

## Adding new variables or dimensions

Use `src/data/sampleData.js` as the single source of variable definitions.

1. Add predictor in `predictorVariables`:

```js
{ key: 'timeManagement', label: 'Time Management' }
```

2. Add anxiety dimension in `anxietyDimensions`:

```js
{ key: 'communicationAnxiety', label: 'Communication Anxiety' }
```

3. Ensure each generated row includes values for new keys in `generateSampleData()`.

4. All charts update automatically because they read variable lists from metadata arrays.

## Notes

- The UI is WCAG-aware (high-contrast dark theme, clear labels, keyboard-reachable controls).
- GSAP is used for subtle entry animation only.
- This project intentionally uses **React only** (no Vue).
