'use client';

import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
};

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '16px 24px',
        borderRadius: '8px',
        background: type === 'success' ? '#10B981' : '#EF4444',
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.3s ease',
      }}
    >
      {message}
    </div>
  );
}
