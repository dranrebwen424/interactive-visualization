import { useMemo, useState } from 'react';

const dimColors = ['#35f2d1', '#f9b46f', '#8aa9ff', '#ff8da1'];

const ScatterPlot = ({ rows, predictor, dimensions, onInspect }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const anxietyOnly = useMemo(() => dimensions.filter(d => d.key !== 'overallAnxiety'), [dimensions]);

  const plotted = useMemo(() => {
    return rows.flatMap((row) => 
      anxietyOnly.map((dim, index) => ({
        id: `${row.id}-${dim.key}`,
        studentId: row.id,
        x: row[predictor.key],
        y: row[dim.key],
        row,
        dimLabel: dim.label,
        dimKey: dim.key,
        color: dimColors[index % dimColors.length]
      }))
    );
  }, [rows, predictor, anxietyOnly]);

  if (!rows.length) {
    return <p className="rounded-lg border border-dashed border-white/20 p-8 text-center text-sm text-mute">No data for current filters.</p>;
  }

  const width = 720;
  const height = 290;
  const margin = 32;
  const scale = (value, maxPx) => margin + ((value - 1) / 4) * (maxPx - margin * 2);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full overflow-visible">
          {/* Grid Lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            const xPos = scale(val, width);
            const yPos = height - scale(val, height);
            return (
              <g key={`grid-${val}`}>
                {/* Vertical line */}
                <line x1={xPos} y1={margin} x2={xPos} y2={height - margin} stroke="rgba(255,255,255,.08)" strokeDasharray="4 4" />
                {/* Horizontal line */}
                <line x1={margin} y1={yPos} x2={width - margin} y2={yPos} stroke="rgba(255,255,255,.08)" strokeDasharray="4 4" />
                
                {/* Grid Labels */}
                <text x={xPos} y={height - margin + 14} textAnchor="middle" className="fill-white/40 text-[10px]">{val}</text>
                <text x={margin - 8} y={yPos + 4} textAnchor="end" className="fill-white/40 text-[10px]">{val}</text>
              </g>
            );
          })}

          {/* Axes Base Lines */}
          <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="rgba(255,255,255,.3)" />
          <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="rgba(255,255,255,.3)" />

          {plotted.map((point) => {
            const cx = scale(point.x, width);
            const cy = height - scale(point.y, height);
            const isHovered = hoveredId === point.id;
            return (
              <circle
                key={point.id}
                cx={cx}
                cy={cy}
                r={isHovered ? 6.5 : 4.5}
                fill={point.color}
                opacity={isHovered ? 1 : 0.85}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() =>
                  onInspect({
                    title: `Record ${point.row.studentCode} (${point.dimLabel})`,
                    reason: 'Scatter point selection',
                    filter: (record) => record.id === point.studentId,
                    columns: ['studentCode', predictor.key, point.dimKey]
                  })
                }
              />
            );
          })}

          <text x={width / 2} y={height - 2} textAnchor="middle" className="fill-mute text-[12px]">{predictor.label}</text>
          <text x="10" y={height / 2} transform={`rotate(-90, 10, ${height / 2})`} textAnchor="middle" className="fill-mute text-[12px]">All Anxiety Dimensions</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 text-[9px] sm:text-[10px] text-mute md:grid-cols-4 shrink-0 px-2 pb-2">
        {anxietyOnly.map((dim, index) => (
          <div key={dim.key} className="flex items-center gap-1.5 truncate">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: dimColors[index % dimColors.length] }} />
            <span className="truncate">{dim.label}</span>
          </div>
        ))}
      </div>

      {hoveredId && (
        <div className="pointer-events-none absolute right-2 top-2 rounded-lg bg-slate-900/95 px-3 py-2 text-xs shadow-ambient z-10">
          {(() => {
            const point = plotted.find((p) => p.id === hoveredId);
            return (
              <>
                <div className="font-semibold" style={{ color: point?.color }}>{point?.dimLabel}</div>
                <div className="text-mute mt-1">Student: {point?.row.studentCode}</div>
                <div className="text-mute">{predictor.label}: {point?.x.toFixed(2)}</div>
                <div className="text-mute">Dimension Score: {point?.y.toFixed(2)}</div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ScatterPlot;
