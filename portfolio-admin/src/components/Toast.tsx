import { useCallback, useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: number) => void;
}) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`toast toast-${toast.type} ${leaving ? 'toast-leaving' : ''}`}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="toast-dot" aria-hidden="true" />
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}

/* ---------- Hook utilitaire pour gérer les toasts ---------- */

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const success = useCallback(
    (message: string) => push('success', message),
    [push],
  );
  const error = useCallback(
    (message: string) => push('error', message),
    [push],
  );
  const info = useCallback(
    (message: string) => push('info', message),
    [push],
  );

  return { toasts, dismiss, success, error, info };
}
