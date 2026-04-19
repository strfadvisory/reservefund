'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateStudyFile, validateStudyFileName } from '@/lib/studyTemplate';

export type UploadReserveStudyModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  defaultAssociationId?: string;
};

type AssociationOption = {
  id: string;
  associationName: string;
};

export function UploadReserveStudyModal({
  open,
  onClose,
  onSubmit,
  defaultAssociationId,
}: UploadReserveStudyModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [associations, setAssociations] = useState<AssociationOption[]>([]);
  const [loadingAssociations, setLoadingAssociations] = useState(false);
  const [association, setAssociation] = useState('');
  const [studyName, setStudyName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingAssociations(true);
    (async () => {
      try {
        const res = await fetch('/api/associations', { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        const list: AssociationOption[] = data.associations || [];
        setAssociations(list);
        setAssociation((prev) => {
          if (prev) return prev;
          if (defaultAssociationId && list.some((a) => a.id === defaultAssociationId)) {
            return defaultAssociationId;
          }
          return list[0]?.id ?? '';
        });
      } catch {
        if (!cancelled) setAssociations([]);
      } finally {
        if (!cancelled) setLoadingAssociations(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, defaultAssociationId]);

  const resetForm = () => {
    setAssociation('');
    setStudyName('');
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  const canCreateManually =
    association.trim() !== '' && studyName.trim() !== '' && !submitting;
  const canUpload = association.trim() !== '' && file !== null && !submitting;

  const handleCreateManually = () => {
    const params = new URLSearchParams({
      associationId: association,
      name: studyName,
    });
    handleClose();
    onSubmit?.();
    router.push(`/study?${params.toString()}`);
  };

  const handleFileChange = async (selected: File | null) => {
    setError('');
    if (!selected) {
      setFile(null);
      return;
    }
    const nameCheck = validateStudyFileName(selected.name);
    if (!nameCheck.ok) {
      setError(nameCheck.reason);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const result = await validateStudyFile(selected);
    if (!result.ok) {
      setError(result.reason);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setFile(selected);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Template.xlsx';
    link.download = 'Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file || !association) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await validateStudyFile(file);
      if (!result.ok) {
        throw new Error(result.reason);
      }
      const form = new FormData();
      form.append('associationId', association);
      form.append('file', file);
      const res = await fetch('/api/reserve-studies', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      resetForm();
      onClose();
      onSubmit?.();
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
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

        <div style={{ padding: '28px 32px 24px' }}>
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
              disabled={loadingAssociations || submitting}
              style={{
                width: '100%',
                height: '44px',
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
                color: association ? '#102C4A' : '#999',
                padding: '0 16px',
                backgroundColor: '#fff',
                cursor: loadingAssociations ? 'wait' : 'pointer',
                outline: 'none',
              }}
            >
              <option value="" disabled>
                {loadingAssociations
                  ? 'Loading…'
                  : associations.length === 0
                  ? 'No associations available'
                  : 'Choose'}
              </option>
              {associations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.associationName}
                </option>
              ))}
            </select>
          </div>

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
              disabled={submitting}
              className="h-11"
              style={{
                borderColor: '#D7D7D7',
                borderRadius: '7px',
                fontSize: '16px',
              }}
            />
          </div>

          <button
            type="button"
            disabled={!canCreateManually}
            onClick={handleCreateManually}
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

          <div
            className="flex items-center"
            style={{ margin: '24px 0', gap: '16px' }}
          >
            <div style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
            <span style={{ color: '#102C4A', fontSize: '16px' }}>Or</span>
            <div style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
          </div>

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
              onClick={handleDownloadTemplate}
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

          <div
            className="flex items-stretch"
            style={{
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              overflow: 'hidden',
              marginBottom: error ? '12px' : '28px',
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
                cursor: submitting ? 'not-allowed' : 'pointer',
                background: '#fff',
                whiteSpace: 'nowrap',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              Upload
            </label>
            <input
              ref={fileInputRef}
              id="urs-fileUpload"
              type="file"
              accept=".xlsx"
              disabled={submitting}
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
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
              {file?.name || ''}
            </div>
          </div>

          {error && (
            <div
              style={{
                color: '#B42318',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={!canUpload}
            onClick={handleUpload}
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
            {submitting ? 'Uploading…' : 'Upload'}
          </button>

          <div className="text-center" style={{ marginTop: '18px' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              style={{
                color: '#102C4A',
                fontSize: '16px',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
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
