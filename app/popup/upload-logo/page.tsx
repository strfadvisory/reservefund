'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UploadLogoModal } from '@/components/upload-logo-modal';

export default function UploadLogoPopupPreview() {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F7F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        padding: '32px',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 22px',
          background: '#0E519B',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '7px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Open Upload Logo Popup
      </button>
      <Link href="/" style={{ color: '#0E519B', fontSize: '14px' }}>
        ← Back to dev index
      </Link>
      <UploadLogoModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
