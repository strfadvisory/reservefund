'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus } from 'lucide-react';

export type UploadLogoResult = {
  file: File;
  size: number;
};

export type UploadLogoModalProps = {
  open: boolean;
  onClose: () => void;
  onApply?: (result: UploadLogoResult) => void;
  title?: string;
};

export function UploadLogoModal({ open, onClose, onApply, title = 'Upload your logo' }: UploadLogoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [size, setSize] = useState(60);
  const [pixelDims, setPixelDims] = useState({ w: 0, h: 0 });
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!preview) {
      setPixelDims({ w: 0, h: 0 });
      setNaturalRatio(null);
      return;
    }
    const measure = () => {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPixelDims({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [preview, size]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setDragActive(false);
    setSize(60);
    setPixelDims({ w: 0, h: 0 });
    setNaturalRatio(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!/image\/(png|jpe?g)/i.test(f.type)) return;
    if (f.size > 2 * 1024 * 1024) return;
    setFile(f);
  };

  const handleApply = () => {
    if (file && onApply) onApply({ file, size });
    handleClose();
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="flex items-center justify-center"
      style={{
        position: 'fixed',
        inset: 0,
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
            padding: '22px 32px',
            borderBottom: '1px solid #D7D7D7',
          }}
        >
          <h2
            className="font-semibold"
            style={{
              color: '#102C4A',
              fontSize: '20px',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        <div style={{ padding: '24px 32px 20px' }}>
          {preview ? (
            <div
              className="flex flex-col items-stretch"
              style={{
                position: 'relative',
                padding: '24px 28px 22px',
                border: '1.5px dashed #B5BCC4',
                borderRadius: '8px',
                background: '#F4F6F9',
                minHeight: '280px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '14px',
                  padding: '4px 10px',
                  background: '#FFFFFF',
                  border: '1px solid #D7D7D7',
                  borderRadius: '9999px',
                  color: '#102C4A',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {pixelDims.w} × {pixelDims.h}px
              </div>
              <div
                className="flex items-center justify-center"
                style={{
                  height: '220px',
                  marginBottom: '18px',
                  overflow: 'hidden',
                }}
              >
                <img
                  ref={imgRef}
                  onLoad={(e) => {
                    const t = e.currentTarget;
                    if (t.naturalWidth && t.naturalHeight) {
                      setNaturalRatio(t.naturalWidth / t.naturalHeight);
                    }
                    const rect = t.getBoundingClientRect();
                    setPixelDims({
                      w: Math.round(rect.width),
                      h: Math.round(rect.height),
                    });
                  }}
                  src={preview}
                  alt="Logo preview"
                  style={{
                    width: `${size}%`,
                    height: 'auto',
                    aspectRatio: naturalRatio ? `${naturalRatio}` : undefined,
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}
              >
                Manage Size
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={1}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="logo-size-slider"
                style={{
                  width: '100%',
                  accentColor: '#0E519B',
                }}
              />
              <div
                className="flex items-center justify-between"
                style={{ marginTop: '14px' }}
              >
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0E519B',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Replace image
                </button>
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#66717D',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Remove
                </button>
              </div>
              <input
                ref={inputRef}
                id="logo-upload-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <label
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFiles(e.dataTransfer.files);
              }}
              htmlFor="logo-upload-input"
              className="flex flex-col items-center justify-center text-center"
              style={{
                padding: '40px 24px',
                border: `1.5px dashed ${dragActive ? '#0E519B' : '#B5BCC4'}`,
                borderRadius: '8px',
                background: '#F4F6F9',
                cursor: 'pointer',
                minHeight: '280px',
              }}
            >
              <ImagePlus
                className="w-12 h-12"
                style={{ color: dragActive ? '#0E519B' : '#102C4A', marginBottom: '26px', transition: 'color 0.2s' }}
                strokeWidth={1.5}
              />
              <div
                style={{
                  color: '#102C4A',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                {dragActive ? 'Drop your logo here' : 'Drag & Drop your Brand Logo'}
              </div>
              <div
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  maxWidth: '320px',
                  marginBottom: '20px',
                }}
              >
                Add a high-quality logo. Max size 2 MB — JPG or PNG format
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#66717D',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
                <span>or</span>
                <span style={{ flex: 1, height: '1px', background: '#D7D7D7' }} />
              </div>
              <span
                style={{
                  marginTop: '12px',
                  display: 'inline-block',
                  padding: '9px 24px',
                  background: '#FFFFFF',
                  border: '1px solid #D7D7D7',
                  borderRadius: '7px',
                  color: '#102C4A',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Browse files
              </span>
              <input
                ref={inputRef}
                id="logo-upload-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={!file}
            className="w-full font-semibold text-white transition-all duration-200"
            style={{
              marginTop: '22px',
              backgroundColor: file ? '#0E519B' : '#0E519B',
              opacity: file ? 1 : 0.75,
              borderRadius: '7px',
              padding: '14px',
              fontSize: '16px',
              border: 'none',
              cursor: file ? 'pointer' : 'not-allowed',
            }}
          >
            Apply
          </button>

          <div className="text-center" style={{ padding: '14px 0 4px' }}>
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
              Now now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
