import { useMemo, useState } from 'react';
import { pearsonCorrelation } from '../utils/stats';

const colorForCorrelation = (r) => {
  const intensity = Math.min(1, Math.abs(r));
  if (r >= 0) {
    return `rgba(53, 242, 209, ${0.2 + intensity * 0.75})`;
  }
  return `rgba(255, 95, 122, ${0.2 + intensity * 0.75})`;
};

const CorrelationHeatmap = ({ rows, predictors, dimensions, onInspect }) => {
  const [hovered, setHovered] = useState(null);

  const anxietyOnly = useMemo(() => dimensions.filter((d) => d.key !== 'overallAnxiety'), [dimensions]);

  const matrix = useMemo(
    () =>
      predictors.map((predictor) =>
        anxietyOnly.map((dimension) => ({
          predictor,
          dimension,
          value: pearsonCorrelation(rows, predictor.key, dimension.key)
        }))
      ),
    [rows, predictors, anxietyOnly]
  );

  if (rows.length < 2) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="rounded-lg border border-dashed border-white/20 p-6 text-center text-sm text-mute">
          Correlation matrix requires at least 2 records ("All Together" view mode).
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full justify-between gap-2">
      <div className="flex-1 min-h-0 grid gap-1" style={{ gridTemplateColumns: `minmax(80px, 1fr) repeat(${anxietyOnly.length}, minmax(40px, 1.5fr))` }}>
        <div />
        {anxietyOnly.map((dimension) => (
          <div key={dimension.key} className="flex items-end justify-center pb-1 text-center text-[9px] sm:text-[11px] leading-tight text-mute break-words hyphens-auto">
            {dimension.label.split(' ').map(w => <span key={w} className="block">{w}</span>)}
          </div>
        ))}

        {matrix.map((row) => (
          <div key={`${row[0].predictor.key}-row`} className="contents">
            <div key={`${row[0].predictor.key}-label`} className="flex items-center text-[9px] sm:text-[11px] text-mute pr-2 leading-tight">
              {row[0].predictor.label}
            </div>
            {row.map((cell) => (
              <button
                key={`${cell.predictor.key}-${cell.dimension.key}`}
                type="button"
                onMouseEnter={() => setHovered(cell)}
                onMouseLeave={() => setHovered(null)}
                onClick={() =>
                  onInspect({
                    title: `${cell.predictor.label} × ${cell.dimension.label}`,
                    reason: 'Heatmap correlation cell',
                    filter: () => true,
                    columns: [cell.predictor.key, cell.dimension.key]
                  })
                }
                className="w-full h-full min-h-[40px] rounded border border-white/10 text-[10px] sm:text-xs text-ink transition-transform hover:scale-[1.03] active:scale-95 flex items-center justify-center"
                style={{ background: colorForCorrelation(cell.value) }}
              >
                {cell.value.toFixed(2)}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px] text-mute shrink-0 pt-2 border-t border-white/10">
        <span>Legend:</span>
        <span className="h-2 w-6 rounded" style={{ background: colorForCorrelation(-1) }} />
        <span>Negative</span>
        <span className="h-2 w-6 rounded" style={{ background: colorForCorrelation(0) }} />
        <span>Zero</span>
        <span className="h-2 w-6 rounded" style={{ background: colorForCorrelation(1) }} />
        <span>Positive</span>
      </div>

      {hovered && (
        <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-slate-900/95 px-3 py-2 text-xs shadow-ambient z-10">
          <strong>{hovered.predictor.label}</strong> vs <strong>{hovered.dimension.label}</strong>
          <div className="mt-1 text-accent font-mono text-[11px]">r = {hovered.value.toFixed(3)}</div>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;
