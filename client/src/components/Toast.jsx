import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border border-theme-border bg-theme-surface/95 backdrop-blur-md text-theme-text transition-all duration-300 animate-slide-in"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px 0 var(--glow-primary)'
          }}
        >
          <div className="text-2xl flex-shrink-0 mt-0.5">{toast.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-theme-text tracking-wide">{toast.title}</h4>
            <p className="text-xs text-theme-muted mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-theme-muted hover:text-theme-text p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
