'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type AssociationItem = {
  name: string;
  role: string;
  logoFileId?: string;
};

export type AssociationPopupProps = {
  open: boolean;
  onClose: () => void;
  items: AssociationItem[];
  selectedIdx?: number;
  onSelect?: (idx: number) => void;
};

export function AssociationPopup({
  open,
  onClose,
  items = [],
  selectedIdx,
  onSelect,
}: AssociationPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number | undefined>(selectedIdx);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    if (onSelect) {
      onSelect(idx);
    }
    // Don't call onClose here - let parent handle it
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(16, 44, 74, 0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 1000,
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '643px',
          maxWidth: '100%',
          border: '1px solid #D7D7D7',
          borderRadius: '7px',
          boxShadow: '0 20px 60px rgba(16, 44, 74, 0.25)',
          margin: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #D7D7D7',
          }}
        >
          <h2
            className="font-semibold"
            style={{
              color: '#102C4A',
              fontSize: '24px',
              lineHeight: 1.3,
            }}
          >
            Select Association
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '8px 0' }}>
          {items.map((item, idx) => {
            const isSelected = idx === selected;
            return (
              <div
                key={idx}
                className="flex items-center justify-between"
                style={{
                  padding: '16px 32px',
                  background: isSelected ? '#F4F6F8' : 'transparent',
                  gap: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelect(idx)}
              >
                <div className="flex items-center" style={{ gap: '16px', minWidth: 0, flex: 1 }}>
                  {item.logoFileId ? (
                    <img
                      src={`/api/logo/${item.logoFileId}`}
                      alt={item.name}
                      style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '10px',
                        flexShrink: 0,
                        background: '#F1F4F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#66717D',
                        fontSize: '18px',
                        fontWeight: 600,
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      className="font-semibold"
                      style={{
                        color: '#102C4A',
                        fontSize: '16px',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ color: '#66717D', fontSize: '14px' }}>
                      {item.role}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelect(idx)}
                  style={{
                    flexShrink: 0,
                    padding: '10px 24px',
                    borderRadius: '7px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isSelected ? 'none' : '1px solid #D7D7D7',
                    background: isSelected ? '#1F2A44' : '#fff',
                    color: isSelected ? '#FFFFFF' : '#102C4A',
                  }}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
