import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"
    />
  );
}

// ── Loading overlay ───────────────────────────────────────────────────────────
export function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size={32} />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ message = 'No data found', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
      <Icon size={40} strokeWidth={1} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, loading, emptyMessage }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            {columns.map((col) => (
              <th key={col.key} className="table-header">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length}><LoadingOverlay /></td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length}><EmptyState message={emptyMessage} /></td></tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
      <span className="text-xs text-slate-500">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                p === page ? 'bg-cyan-500 text-slate-950' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Confirm delete dialog ─────────────────────────────────────────────────────
export function ConfirmDialog({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 max-w-sm w-full animate-slide-up">
        <p className="text-sm text-slate-300 mb-5">{message || 'Are you sure? This cannot be undone.'}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}