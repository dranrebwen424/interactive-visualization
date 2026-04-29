import { toCsv } from '../utils/stats';

const RawDataDrawer = ({ state, onClose }) => {
  const { open, title, reason, rows, columns } = state;

  if (!open) return null;

  const exportCsv = () => {
    const csvContent = toCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'anxiety-dashboard-selection.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/45">
      <aside className="h-full w-full max-w-[720px] overflow-hidden border-l border-white/20 bg-slate-950/95 p-4 md:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg text-ink">{title}</h3>
            <p className="text-xs text-mute">{reason} · {rows.length} record(s)</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-md border border-accent/40 bg-accent/20 px-3 py-1 text-xs text-ink"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/20 bg-panelSoft px-3 py-1 text-xs text-ink"
            >
              Close
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/20 p-8 text-center text-sm text-mute">No matching raw rows.</p>
        ) : (
          <div className="max-h-[calc(100vh-130px)] overflow-auto rounded-lg border border-white/10">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-panel">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="border-b border-white/10 px-3 py-2 text-mute">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="even:bg-white/[0.03]">
                    {columns.map((column) => (
                      <td key={`${row.id}-${column}`} className="border-b border-white/5 px-3 py-2 text-ink">
                        {String(row[column] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </aside>
    </div>
  );
};

export default RawDataDrawer;
