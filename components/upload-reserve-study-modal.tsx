'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type UploadReserveStudyModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export function UploadReserveStudyModal({
  open,
  onClose,
  onSubmit,
}: UploadReserveStudyModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [association, setAssociation] = useState('');
  const [studyName, setStudyName] = useState('');
  const [fileName, setFileName] = useState('');

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

  const handleClose = () => {
    setAssociation('');
    setStudyName('');
    setFileName('');
    onClose();
  };

  const canCreateManually = association.trim() !== '' && studyName.trim() !== '';
  const canUpload = association.trim() !== '' && fileName.trim() !== '';

  const handleSubmit = () => {
    handleClose();
    onSubmit?.();
    router.push('/study');
  };

  if (!mounted || !open) return null;

  const modalContent = (
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
      onClick={handleClose}
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
            Upload Reserver Study
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 24px' }}>
          {/* Select Association */}
          <div style={{ marginBottom: '20px' }}>
            <Label
              htmlFor="urs-association"
              style={{
                color: '#102C4A',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Select Association<span>*</span>
            </Label>
            <select
              id="urs-association"
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
                color: association ? '#102C4A' : '#999',
                padding: '0 16px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" disabled>Choose</option>
              <option value="caldron">Caldron Associations</option>
              <option value="apex">Apex Global</option>
              <option value="horizon">Horizon HOA</option>
            </select>
          </div>

          {/* Reserver Study Name */}
          <div style={{ marginBottom: '24px' }}>
            <Label
              htmlFor="urs-studyName"
              style={{
                color: '#102C4A',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Reserver Study Name <span>*</span>
            </Label>
            <Input
              id="urs-studyName"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              className="h-11"
              style={{
                borderColor: '#D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
              }}
            />
          </div>

          {/* Create Manually */}
          <button
            type="button"
            disabled={!canCreateManually}
            onClick={handleSubmit}
            className="w-full font-semibold transition-all duration-200"
            style={{
              background: '#EFF4FA',
              color: canCreateManually ? '#0E519B' : '#A6B2C1',
              borderRadius: '7px',
              padding: '14px',
              fontSize: '16px',
              border: 'none',
              cursor: canCreateManually ? 'pointer' : 'not-allowed',
              opacity: canCreateManually ? 1 : 0.7,
            }}
          >
            Create Manually
          </button>

          {/* Or divider */}
          <div
            className="flex items-center"
            style={{ margin: '24px 0', gap: '16px' }}
          >
            <div style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
            <span style={{ color: '#102C4A', fontSize: '16px' }}>Or</span>
            <div style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
          </div>

          {/* Template description + download link */}
          <div
            className="flex items-start justify-between"
            style={{ gap: '16px', marginBottom: '12px' }}
          >
            <p
              style={{
                color: '#102C4A',
                fontSize: '15px',
                lineHeight: 1.5,
                maxWidth: '360px',
              }}
            >
              Download the template format and upload the completed file here
            </p>
            <button
              type="button"
              style={{
                color: '#0E519B',
                fontSize: '15px',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Download Template
            </button>
          </div>

          {/* File upload field */}
          <div
            className="flex items-stretch"
            style={{
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              overflow: 'hidden',
              marginBottom: '28px',
            }}
          >
            <label
              htmlFor="urs-fileUpload"
              style={{
                padding: '12px 22px',
                borderRight: '1px solid #D7D7D7',
                color: '#102C4A',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                background: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              Upload
            </label>
            <input
              id="urs-fileUpload"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
            />
            <div
              className="flex items-center"
              style={{
                flex: 1,
                padding: '12px 16px',
                color: '#66717D',
                fontSize: '15px',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {fileName}
            </div>
          </div>

          {/* Upload submit */}
          <button
            type="button"
            disabled={!canUpload}
            onClick={handleSubmit}
            className="w-full font-semibold text-white transition-all duration-200"
            style={{
              backgroundColor: canUpload ? '#0E519B' : '#B5BCC4',
              borderRadius: '7px',
              padding: '14px',
              fontSize: '16px',
              border: 'none',
              cursor: canUpload ? 'pointer' : 'not-allowed',
            }}
          >
            Upload
          </button>

          {/* Not now */}
          <div className="text-center" style={{ marginTop: '18px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                color: '#102C4A',
                fontSize: '16px',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
