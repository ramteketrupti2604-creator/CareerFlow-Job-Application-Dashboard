
# CareerFlow Dashboard

CareerFlow is a lightweight, production-minded React dashboard for tracking job applications. It demonstrates modern front-end practices suitable for portfolio and interview demos: persistent local data storage, performant UI, interactive visualizations, and a premium dark theme.

## Technical Architecture

- Framework: React 18 (Vite dev tooling)
- Build: Vite
- State persistence: `useLocalStorage` custom hook (wraps React state with localStorage reads/writes)
- Charts & visualization: `recharts` (AreaChart for trends, PieChart for distribution)
- Styling: Plain CSS in `src/styles/global.css` with a premium dark SaaS palette (indigo/slate tones)

Core files:
- `src/App.jsx` — application root, provides add/update/remove/clear handlers
- `src/hooks/useLocalStorage.js` — central persistence hook used for all application data
- `src/components/AddJobForm.jsx` — form to add applications (includes Priority)
- `src/components/Dashboard.jsx` — main UI: smart search, filters, charts, table, edit/archive actions

## Key Challenges Faced

1. Data Persistence:
	- Requirement: ensure user data is not lost on refresh or accidental navigation.
	- Challenge: synchronous reads/writes to localStorage can cause stale UI and hard-to-track state if not centralized.

2. Performance with Filtering and Large Lists:
	- Requirement: fast UI when searching, filtering, and rendering charts over application history.
	- Challenge: unnecessary recalculations or re-renders for every keystroke or data change could degrade UX.

3. UX for Data Management:
	- Requirement: let users correct mistakes (edit), temporarily remove items (archive) and clear data safely (confirmation).
	- Challenge: designing lightweight inline edit flows and safe destructive actions.

## Optimized Solutions Implemented

1. Centralized Local Storage Hook (`useLocalStorage`):
	- Implementation: a single hook wraps `useState` and `useEffect` to serialize/deserialize application state to `localStorage`.
	- Benefit: predictable persistence surface; all updates go through the same setter, ensuring data is saved immediately and consistently.

2. Memoized Selectors with `useMemo`:
	- Usage: the Dashboard uses `useMemo` for derived data (visible jobs, filtered jobs, monthly aggregation, status counts).
	- Benefit: expensive computations (like aggregating months for charts) only re-run when their dependencies change, preventing unnecessary work during typing or minor UI updates.

3. Interactive, Lightweight Charts:
	- `recharts` AreaChart is used for the 6-month trend; aggregations are precomputed and memoized.
	- PieChart shows distribution by status; color mapping is deterministic.

4. Improved UX Patterns:
	- Inline editing: quick edits happen in-place with `Save`/`Cancel` options.
	- Archive vs Delete: archiving hides items from the primary list but preserves them in storage for recovery; delete is destructive.
	- Clear All: destructive action protected by a confirmation dialog.

## Performance Considerations (for interviews)

- useMemo: applied to data transforms (filtering, aggregation). Note how the dependency arrays are kept minimal and stable.
- LocalStorage writes are done in an effect; for very large datasets consider batching or using an IndexedDB-backed solution.
- Charts are fed pre-aggregated arrays to minimize render-time work in the visualization library.

## File Structure (important files)

- `index.html`
- `package.json`
- `src/main.jsx`
- `src/App.jsx`
- `src/components/Dashboard.jsx`
- `src/components/AddJobForm.jsx`
- `src/hooks/useLocalStorage.js`
- `src/styles/global.css`

## How to Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

## Notes & Future Improvements

- For multi-user or cross-device persistence, replace the localStorage hook with an API-backed sync (and employ optimistic UI patterns).
- For very large histories, switch persistence to IndexedDB (e.g., via `idb`) and virtualize the table rows (e.g., `react-window`).
- Add unit tests around data transforms and memoized selectors to document expected behavior and guard regressions.

---

If you want, I can also add a short `Technical Notes` section that includes key code snippets and rationale (for sharing with recruiters). Would you like that? 

