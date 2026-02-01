import { useEffect, useMemo, useState } from 'react';

export default function CommandPalette({ open, onClose, actions }) {
  const [query, setQuery] = useState('');
  const items = useMemo(() => {
    const q = query.toLowerCase();
    return actions.filter((a) => a.title.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="w-[560px] bg-[#0d0d10] text-white border border-slate-800 rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Type a command..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-900 p-3 outline-none border-b border-slate-800"
        />
        <div className="max-h-80 overflow-auto">
          {items.map((a) => (
            <button
              key={a.id}
              onClick={() => { a.run(); onClose(); }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800"
            >
              {a.title}
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-3 py-4 text-slate-400 text-sm">No commands</div>
          )}
        </div>
      </div>
    </div>
  );
}


