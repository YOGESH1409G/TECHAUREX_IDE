import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const toast = { id, message, type: opts.type || 'info', timeout: opts.timeout ?? 2500 };
    setToasts((t) => [...t, toast]);
    if (toast.timeout > 0) setTimeout(() => remove(id), toast.timeout);
    return id;
  }, [remove]);

  const api = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <WindowListeners show={show} />
      <div className="fixed bottom-4 right-4 z-[70] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded shadow border ${
            t.type === 'error' ? 'bg-red-900/80 border-red-700 text-white' :
            t.type === 'success' ? 'bg-green-900/80 border-green-700 text-white' :
            'bg-slate-900/80 border-slate-700 text-white'
          }`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

function WindowListeners({ show }) {
  // Allow other components to dispatch global toast events
  useEffect(() => {
    const handler = (e) => show(e.detail?.message || 'Done', e.detail?.opts);
    window.addEventListener('APP_TOAST', handler);
    return () => window.removeEventListener('APP_TOAST', handler);
  }, [show]);
  return null;
}


