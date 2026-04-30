import { useMemo, useState } from 'react';
import { groupRows, mean } from '../utils/stats';

const metricColor = (index) => [
  '#35f2d1', '#f9b46f', '#8aa9ff', '#ff8da1', 
  '#a8bdd9', '#ff5f7a', '#c084fc', '#fde047'
][index % 8];

const InteractiveBarChart = ({ rows, subgroupBy, dimensions, predictors, onInspect }) => {
  const [hovered, setHovered] = useState(null);

  const metrics = useMemo(
    () => [...dimensions.filter((item) => item.key !== 'overallAnxiety'), ...predictors],
    [dimensions, predictors]
  );

  const grouped = useMemo(() => {
    if (subgroupBy === 'overall') {
      const map = new Map();
      map.set('Overall Average', rows);
      return map;
    }
    return groupRows(rows, subgroupBy);
  }, [rows, subgroupBy]);
  const groups = Array.from(grouped.entries());

  if (!rows.length || !groups.length) {
    return <p className="rounded-lg border border-dashed border-white/20 p-8 text-center text-sm text-mute">No data for current filters.</p>;
  }

  const width = 920;
  const height = 300;
  const margin = { top: 20, right: 12, bottom: 30, left: 36 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const allMeans = groups.flatMap(([groupName, groupRowsData]) =>
    metrics.map((metric) => ({ groupName, metric: metric.key, value: mean(groupRowsData, metric.key) }))
  );

  const maxValue = Math.max(...allMeans.map((item) => item.value), 5);
  const groupBand = innerW / groups.length;
  const barBand = groupBand / metrics.length;

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 relative w-full overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="min-w-[700px] md:min-w-0 w-full h-full relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full overflow-visible">
            <g transform={`translate(${margin.left} ${margin.top})`}>
            {Array.from({ length: 6 }).map((_, index) => {
              const y = innerH - (index / 5) * innerH;
              return (
                <g key={`grid-${index}`}>
                  <line x1="0" x2={innerW} y1={y} y2={y} stroke="rgba(255,255,255,.12)" strokeDasharray="4 3" />
                  <text x="-8" y={y + 4} textAnchor="end" className="fill-mute text-[10px]">
                    {(index).toFixed(0)}
                  </text>
                </g>
              );
            })}

            {groups.map(([groupName, groupRowsData], groupIndex) => {
              const groupX = groupIndex * groupBand;
              return (
                <g key={groupName}>
                  {metrics.map((metric, metricIndex) => {
                    const value = mean(groupRowsData, metric.key);
                    const barH = (value / maxValue) * innerH;
                    const x = groupX + metricIndex * barBand + 2;
                    const y = innerH - barH;
                    return (
                      <rect
                        key={`${groupName}-${metric.key}`}
                        x={x}
                        y={y}
                        width={Math.max(barBand - 5, 3)}
                        height={barH}
                        rx="5"
                        fill={metricColor(metricIndex)}
                        opacity={0.92}
                        className="cursor-pointer transition-opacity hover:opacity-100"
                        onMouseEnter={() => setHovered({ groupName, metric: metric.label, value })}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onInspect({
                          title: `${metric.label} - ${groupName}`,
                          reason: 'Bar chart selection',
                          filter: (record) => subgroupBy === 'overall' ? true : record[subgroupBy] === groupName,
                          columns: subgroupBy === 'overall' ? ['studentCode', metric.key] : [subgroupBy, metric.key]
                        })}
                      />
                    );
                  })}
                  <text x={groupX + groupBand / 2} y={innerH + 16} textAnchor="middle" className="fill-ink text-[12px] font-medium">
                    {groupName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] sm:text-xs text-mute md:grid-cols-4 shrink-0 px-2 pb-2">
        {metrics.map((metric, index) => (
          <div key={metric.key} className="flex items-center gap-2 truncate">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: metricColor(index) }} />
            <span className="truncate">{metric.label}</span>
          </div>
        ))}
      </div>

      {hovered && (
        <div className="pointer-events-none absolute right-2 top-2 rounded-lg bg-slate-900/95 px-3 py-2 text-xs shadow-ambient z-10">
          <div className="font-semibold text-ink">{hovered.metric}</div>
          <div className="text-mute">Student: {hovered.groupName}</div>
          <div className="text-accent">Value: {hovered.value.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default InteractiveBarChart;
