import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import InteractiveBarChart from './components/InteractiveBarChart';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import ScatterPlot from './components/ScatterPlot';
import ConceptualFramework from './components/ConceptualFramework';
import RawDataDrawer from './components/RawDataDrawer';
import { anxietyDimensions, generateSampleData, predictorVariables, theoreticalNodes } from './data/sampleData';
import { applyFilters } from './utils/stats';

const ChartCard = ({ title, subtitle, action, children, className = '' }) => (
  <div className={`glass rounded-2xl p-4 flex flex-col ${className}`}>
    <div className="mb-4 shrink-0 flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-4">
      <div>
        <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-mute mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </div>
    {children}
  </div>
);

const initialRows = generateSampleData(260);

const App = () => {
  const shellRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    viewMode: 'individual',
    predictor: predictorVariables[0].key
  });

  const [drawer, setDrawer] = useState({
    open: false,
    title: '',
    reason: '',
    rows: [],
    columns: ['id', 'studentCode']
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setRows(initialRows);
      } catch (loadError) {
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shellRef.current || loading) return;
    gsap.fromTo(
      shellRef.current.querySelectorAll('[data-animate]'),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out' }
    );
  }, [loading]);

  const controlOptions = useMemo(() => {
    return {
      viewModes: [
        { value: 'individual', label: 'Individual Students' },
        { value: 'combined', label: 'Combined Average' }
      ],
      predictors: predictorVariables.map((item) => ({ value: item.key, label: item.label }))
    };
  }, [rows]);

  const filteredRows = useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const selectedPredictor = useMemo(
    () => predictorVariables.find((item) => item.key === filters.predictor) || predictorVariables[0],
    [filters.predictor]
  );

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleInspect = ({ title, reason, filter, columns = [] }) => {
    const drillRows = filteredRows.filter(filter);
    const defaultColumns = ['id', 'studentCode'];
    const chosenColumns = [...new Set([...defaultColumns, ...columns])].filter((key) => key in (rows[0] || {}));
    setDrawer({ open: true, title, reason, rows: drillRows, columns: chosenColumns.length ? chosenColumns : defaultColumns });
  };

  if (loading) {
    return <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6 text-mute">Loading anxiety dashboard...</main>;
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="glass rounded-xl p-6 text-center">
          <p className="font-heading text-xl text-danger">Error</p>
          <p className="mt-2 text-sm text-mute">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-md border border-white/20 px-4 py-2 text-sm"
            onClick={() => {
              setLoading(true);
              setError('');
              setRows(generateSampleData(260));
              setLoading(false);
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main ref={shellRef} className="h-[100dvh] w-full overflow-hidden bg-background p-3 md:p-4 flex flex-col gap-4 relative">
      <header data-animate className="mb-6 glass rounded-2xl p-4 shrink-0 flex items-center justify-between z-20">
        <div>
          <h1 className="font-heading text-xl text-ink md:text-2xl">Anxiety Predictors Dashboard</h1>
          <p className="text-xs text-mute mt-1">Interactive analysis of English Language Anxiety.</p>
        </div>
      </header>

      {filteredRows.length === 0 ? (
        <section data-animate className="glass rounded-2xl p-10 text-center text-sm text-mute flex-1 flex items-center justify-center">
          No records match current global filters. Adjust controls to continue.
        </section>
      ) : (
        <section className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 auto-rows-auto md:grid-rows-6 gap-4 overflow-y-auto md:overflow-hidden no-scrollbar">
          
          {/* Summary Card - Span 3 cols, 6 rows (Full left column) */}
          <div data-animate className="col-span-1 md:col-span-3 row-span-1 md:row-span-6 min-h-[400px] md:min-h-0 h-full">
            <div className="glass rounded-2xl p-5 h-full flex flex-col gap-3 overflow-auto no-scrollbar">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="font-heading text-lg font-bold text-ink">Key Insights</h2>
              </div>

              {/* Metric 1 */}
              <div className="rounded-xl bg-gradient-to-br from-panel/60 to-panel/30 p-4 border border-white/10 relative overflow-hidden group hover:border-accent/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all"></div>
                <p className="text-[10px] text-mute uppercase tracking-widest font-bold mb-1">Dataset Size</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-ink leading-none">{filteredRows.length}</span>
                  <span className="text-xs text-mute pb-1 font-medium">Students</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="rounded-xl bg-gradient-to-br from-panel/60 to-panel/30 p-4 border border-white/10 relative overflow-hidden group hover:border-danger/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-danger/10 rounded-full blur-xl group-hover:bg-danger/20 transition-all"></div>
                <p className="text-[10px] text-mute uppercase tracking-widest font-bold mb-1">Critical Finding</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-danger leading-none">r = -.89</span>
                </div>
                <p className="text-xs text-ink/80 leading-relaxed">
                  <strong className="text-ink">Self-Confidence</strong> severely drops when <strong className="text-ink">Language Proficiency</strong> is low <span className="text-mute">(p = .039)</span>.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="rounded-xl bg-gradient-to-br from-panel/60 to-panel/30 p-4 border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                <p className="text-[10px] text-mute uppercase tracking-widest font-bold mb-1">Notable Trend</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary leading-none">r = .86</span>
                </div>
                <p className="text-xs text-ink/80 leading-relaxed">
                  <strong className="text-ink">Communication Anxiety</strong> strongly triggers <strong className="text-ink">Test Anxiety</strong> <span className="text-mute">(p = .058)</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Correlation Heatmap - Span 5 cols, 3 rows */}
          <div data-animate className="col-span-1 md:col-span-5 row-span-1 md:row-span-3 min-h-[400px] md:min-h-0 h-full">
            <ChartCard title="Correlation Matrix" subtitle="Predictors vs Anxiety Dimensions" className="h-full">
              <CorrelationHeatmap rows={filteredRows} predictors={predictorVariables} dimensions={anxietyDimensions} onInspect={handleInspect} />
            </ChartCard>
          </div>

          {/* Bar Comparison - Span 4 cols, 3 rows */}
          <div data-animate className="col-span-1 md:col-span-4 row-span-1 md:row-span-3 min-h-[400px] md:min-h-0 h-full flex flex-col">
            <ChartCard 
              title="Mean Scores" 
              subtitle={filters.viewMode === 'individual' ? "Individual Student Scores" : "Overall Sample Average"} 
              className="flex-1 min-h-0 flex flex-col"
              action={
                <select 
                  className="w-full sm:w-auto bg-panel/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-ink outline-none focus:border-accent cursor-pointer"
                  value={filters.viewMode}
                  onChange={(e) => handleFilterChange('viewMode', e.target.value)}
                >
                  <option value="individual">Individual Students</option>
                  <option value="combined">Combined Average</option>
                </select>
              }
            >
              <div className="flex-1 min-h-0 relative">
                <InteractiveBarChart rows={filteredRows} subgroupBy={filters.viewMode === 'individual' ? 'studentCode' : 'overall'} predictors={predictorVariables} dimensions={anxietyDimensions} onInspect={handleInspect} />
              </div>
            </ChartCard>
          </div>

          {/* Multi-series Scatter Plot - Span 4 cols, 3 rows */}
          <div data-animate className="col-span-1 md:col-span-4 row-span-1 md:row-span-3 min-h-[400px] md:min-h-0 h-full flex flex-col">
            <ChartCard 
              title="Predictor Distribution" 
              subtitle={`X: ${selectedPredictor.label} | Y: All Anxiety`} 
              className="flex-1 min-h-0 flex flex-col"
              action={
                <select 
                  className="w-full sm:w-auto bg-panel/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-ink outline-none focus:border-accent cursor-pointer sm:max-w-[160px] truncate"
                  value={filters.predictor}
                  onChange={(e) => handleFilterChange('predictor', e.target.value)}
                >
                  {predictorVariables.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              }
            >
              <div className="flex-1 min-h-0 relative">
                <ScatterPlot rows={filteredRows} predictor={selectedPredictor} dimensions={anxietyDimensions} onInspect={handleInspect} />
              </div>
            </ChartCard>
          </div>

          {/* Conceptual Framework - Span 5 cols, 3 rows */}
          <div data-animate className="col-span-1 md:col-span-5 row-span-1 md:row-span-3 min-h-[400px] md:min-h-0 h-full">
            <ChartCard title="Theoretical Map" subtitle="Connections and framework" className="h-full">
              <ConceptualFramework rows={filteredRows} predictors={predictorVariables} dimensions={anxietyDimensions} theoryNodes={theoreticalNodes} onInspect={handleInspect} />
            </ChartCard>
          </div>

        </section>
      )}


      <RawDataDrawer state={drawer} onClose={() => setDrawer((current) => ({ ...current, open: false }))} />
    </main>
  );
};

export default App;
