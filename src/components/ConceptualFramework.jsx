import { useMemo, useState } from 'react';
import { pearsonCorrelation } from '../utils/stats';

const basePositions = {
  selfConfidence: { x: 100, y: 80 },
  languageProficiency: { x: 100, y: 160 },
  peerInfluence: { x: 100, y: 240 },
  classroomEnvironment: { x: 100, y: 320 },
  communicationAnxiety: { x: 340, y: 80 },
  fearOfNegativeEvaluation: { x: 340, y: 160 },
  testAnxiety: { x: 340, y: 240 },
  englishClassAnxiety: { x: 340, y: 320 },
  selfConfidenceTheory: { x: 580, y: 120 },
  negativeEvaluation: { x: 580, y: 200 },
  languageProficiencyTheory: { x: 580, y: 280 }
};

const nodeColor = {
  predictor: '#35f2d1',
  anxiety: '#ff8da1',
  theory: '#8aa9ff'
};

const ConceptualFramework = ({ rows, predictors, dimensions, theoryNodes, onInspect }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragStart, setDragStart] = useState(null);
  const [hovered, setHovered] = useState(null);

  const anxietyOnly = useMemo(() => dimensions.filter((item) => item.key !== 'overallAnxiety'), [dimensions]);

  const nodes = useMemo(
    () => [
      ...predictors.map((item) => ({ ...item, id: item.key, type: 'predictor', details: 'Student predictor variable.' })),
      ...anxietyOnly.map((item) => ({ ...item, id: item.key, type: 'anxiety', details: 'Anxiety dimension.' })),
      ...theoryNodes.map(t => ({ ...t, id: t.id }))
    ],
    [predictors, anxietyOnly, theoryNodes]
  );

  const edges = useMemo(() => {
    const correlationEdges = predictors.flatMap((predictor) =>
      anxietyOnly.map((dimension) => ({
        source: predictor.key,
        target: dimension.key,
        weight: Math.abs(pearsonCorrelation(rows, predictor.key, dimension.key)),
        details: `${predictor.label} → ${dimension.label}`
      }))
    ).filter(e => e.weight > 0.4); // Only show stronger correlations to reduce clutter

    const theoryEdges = [
      { source: 'selfConfidenceTheory', target: 'selfConfidence', weight: 0.8, details: 'Theory foundation' },
      { source: 'negativeEvaluation', target: 'fearOfNegativeEvaluation', weight: 0.85, details: 'Theory foundation' },
      { source: 'languageProficiencyTheory', target: 'languageProficiency', weight: 0.75, details: 'Theory foundation' }
    ];

    return [...correlationEdges, ...theoryEdges];
  }, [rows, predictors, anxietyOnly]);

  const handleWheel = (event) => {
    event.preventDefault();
    const zoom = event.deltaY > 0 ? -0.08 : 0.08;
    setTransform((current) => ({ ...current, scale: Math.min(2.1, Math.max(0.7, current.scale + zoom)) }));
  };

  const startDrag = (event) => setDragStart({ x: event.clientX - transform.x, y: event.clientY - transform.y });
  const duringDrag = (event) => {
    if (!dragStart) return;
    setTransform((current) => ({ ...current, x: event.clientX - dragStart.x, y: event.clientY - dragStart.y }));
  };
  const endDrag = () => setDragStart(null);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 relative w-full overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="min-w-[690px] md:min-w-0 w-full h-full relative">
          <svg
            viewBox="0 0 690 420"
            className="absolute inset-0 w-full h-full cursor-grab rounded-xl border border-white/10 bg-slate-950/40"
            onWheel={handleWheel}
          onMouseDown={startDrag}
          onMouseMove={duringDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {edges.map((edge) => {
              const from = basePositions[edge.source];
              const to = basePositions[edge.target];
              if (!from || !to) return null;
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={edge.source.includes('Theory') || edge.source === 'negativeEvaluation' ? '#8aa9ff' : '#35f2d1'}
                  strokeOpacity={0.2 + edge.weight * 0.6}
                  strokeWidth={1 + edge.weight * 2.5}
                />
              );
            })}

            {nodes.map((node) => {
              const pos = basePositions[node.id];
              if (!pos) return null;

              const getNodeSelection = () => {
                if (!rows.length) {
                  return { filter: () => false, columns: ['id', 'studentCode'] };
                }

                if (node.type === 'predictor' || node.type === 'anxiety') {
                  const avg = rows.reduce((sum, row) => sum + row[node.id], 0) / rows.length;
                  return {
                    filter: (record) => record[node.id] >= avg,
                    columns: [node.id]
                  };
                }

                return {
                  filter: () => true,
                  columns: ['overallAnxiety']
                };
              };

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseEnter={() => setHovered(node)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    const selection = getNodeSelection();
                    onInspect({
                      title: node.label,
                      reason: 'Conceptual map node',
                      filter: selection.filter,
                      columns: selection.columns
                    });
                  }}
                  className="cursor-pointer"
                >
                  <circle 
                    r={hovered?.id === node.id ? "21" : "18"} 
                    fill={nodeColor[node.type]} 
                    fillOpacity="0.92" 
                    className="transition-all duration-200" 
                  />
                  <text y="34" textAnchor="middle" className="fill-ink text-[11px] font-medium">{node.label}</text>
                </g>
              );
            })}
          </g>
        </svg>
        </div>
      </div>

      {hovered && (
        <aside className="pointer-events-none absolute right-4 top-4 max-w-[220px] rounded-lg border border-white/20 bg-slate-900/95 p-3 text-xs shadow-ambient z-10">
          <p className="font-semibold text-ink">{hovered.label}</p>
          <p className="text-mute mt-1">{hovered.details}</p>
        </aside>
      )}
    </div>
  );
};

export default ConceptualFramework;
