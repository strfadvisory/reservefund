'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ToastKind = 'success' | 'error';

type ToastEntry = {
  id: number;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  notify: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;
const TOAST_TTL = 3500;

const SUPPRESSED_PATH_PREFIXES = [
  '/api/auth/me',
  '/api/auth/info',
  '/api/auth/debug',
  '/api/orgs/mine',
  '/api/dashboard',
  '/api/activity',
  '/api/invite/pending',
  '/api/geocode',
  '/api/logo/',
  '/api/profile/image/',
  '/api/profile/logo/',
];

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function toPathname(url: string): string | null {
  try {
    if (url.startsWith('/')) return url.split('?')[0];
    const u = new URL(url, window.location.origin);
    if (u.origin !== window.location.origin) return null;
    return u.pathname;
  } catch {
    return null;
  }
}

function isSuppressed(pathname: string): boolean {
  return SUPPRESSED_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

function successMessageFor(method: string, pathname: string, body: any): string {
  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message.trim()) return body.message;
    if (typeof body.toast === 'string' && body.toast.trim()) return body.toast;
  }
  const verb = method.toUpperCase();
  const resource = pathname.replace(/^\/api\//, '').split('/')[0] || 'request';
  const label = resource.replace(/[-_]/g, ' ');
  if (verb === 'POST') return `${label.charAt(0).toUpperCase()}${label.slice(1)} created`;
  if (verb === 'PUT' || verb === 'PATCH') return `${label.charAt(0).toUpperCase()}${label.slice(1)} updated`;
  if (verb === 'DELETE') return `${label.charAt(0).toUpperCase()}${label.slice(1)} deleted`;
  return 'Request completed';
}

function errorMessageFor(status: number, body: any, fallback: string): string {
  if (body && typeof body === 'object') {
    if (typeof body.error === 'string' && body.error.trim()) return body.error;
    if (typeof body.message === 'string' && body.message.trim()) return body.message;
  }
  if (status === 0) return 'Network error. Please check your connection.';
  if (status === 401) return 'Session expired. Please sign in again.';
  if (status === 403) return 'You do not have permission for that action.';
  if (status === 404) return 'Resource not found.';
  if (status >= 500) return 'Server error. Please try again.';
  return fallback || `Request failed (${status})`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextIdRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message: string, kind: ToastKind = 'success') => {
    if (!message) return;
    const id = nextIdRef.current++;
    setToasts((prev) => {
      const next = [...prev, { id, message, kind }];
      return next.slice(-MAX_VISIBLE);
    });
    setTimeout(() => dismiss(id), TOAST_TTL);
  }, [dismiss]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const original = window.fetch.bind(window);
    const interceptor: typeof window.fetch = async (input, init) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url;
      const method = (init?.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();

      const pathname = toPathname(url);
      const shouldReport = pathname !== null && pathname.startsWith('/api/') && !isSuppressed(pathname);

      let response: Response;
      try {
        response = await original(input as any, init);
      } catch (err: any) {
        if (shouldReport) {
          notify(err?.message || 'Network error. Please check your connection.', 'error');
        }
        throw err;
      }

      if (shouldReport) {
        const cloned = response.clone();
        const bodyPromise = cloned
          .json()
          .catch(() => null as any);

        bodyPromise.then((parsed) => {
          if (!response.ok) {
            notify(errorMessageFor(response.status, parsed, response.statusText), 'error');
            return;
          }
          if (MUTATING_METHODS.has(method)) {
            notify(successMessageFor(method, pathname!, parsed), 'success');
          }
        });
      }
      return response;
    };
    window.fetch = interceptor;
    return () => {
      window.fetch = original;
    };
  }, [notify]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{
              pointerEvents: 'auto',
              padding: '14px 22px',
              minWidth: '260px',
              maxWidth: '420px',
              borderRadius: '8px',
              color: '#FFFFFF',
              background: t.kind === 'success' ? '#10B981' : '#EF4444',
              boxShadow: '0 10px 24px rgba(16, 44, 74, 0.18)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
            onClick={() => dismiss(t.id)}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      notify: (message, kind = 'success') => {
        console.warn('[toast] provider not mounted:', kind, message);
      },
    };
  }
  return ctx;
}
