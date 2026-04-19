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

const CONTAINER = 320;
const MASK = 100;
const MASK_LEFT = (CONTAINER - MASK) / 2;
const MASK_TOP = (CONTAINER - MASK) / 2;

export function UploadLogoModal({ open, onClose, onApply, title = 'Upload your logo' }: UploadLogoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0); // 0-100 slider; mapped to scale range
  const [dragging, setDragging] = useState<null | { dx: number; dy: number }>(null);

  const inputRef = useRef<HTMLInputElement>(null);

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

  const minScale = natural.w && natural.h ? Math.max(MASK / natural.w, MASK / natural.h) : 1;
  const maxScale = Math.max(minScale * 4, minScale + 0.01);
  const scale = minScale + ((maxScale - minScale) * zoom) / 100;
  const dw = natural.w * scale;
  const dh = natural.h * scale;

  const clamp = (pos: { x: number; y: number }, dispW: number, dispH: number) => ({
    x: Math.min(MASK_LEFT, Math.max(MASK_LEFT + MASK - dispW, pos.x)),
    y: Math.min(MASK_TOP, Math.max(MASK_TOP + MASK - dispH, pos.y)),
  });

  // Center image on first load / natural-dims change
  useEffect(() => {
    if (!natural.w || !natural.h) return;
    const s = minScale; // start at min (zoom=0)
    const w = natural.w * s;
    const h = natural.h * s;
    setImgPos(clamp({ x: (CONTAINER - w) / 2, y: (CONTAINER - h) / 2 }, w, h));
    setZoom(0);
  }, [natural.w, natural.h]);

  // Re-clamp on zoom change, preserving mask-center focus
  useEffect(() => {
    if (!natural.w || !natural.h) return;
    setImgPos((prev) => {
      // find which natural-image point is at mask center now
      // prevScale used prev dw/dh ratio; approximate by re-clamping with new dims
      return clamp(prev, dw, dh);
    });
  }, [zoom, natural.w, natural.h]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setDragActive(false);
    setNatural({ w: 0, h: 0 });
    setImgPos({ x: 0, y: 0 });
    setZoom(0);
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

  const onImgMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging({ dx: e.clientX - imgPos.x, dy: e.clientY - imgPos.y });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const raw = { x: e.clientX - dragging.dx, y: e.clientY - dragging.dy };
      setImgPos(clamp(raw, dw, dh));
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, dw, dh]);

  const handleApply = async () => {
    if (!file || !preview || !natural.w) {
      handleClose();
      return;
    }
    // Source area on natural image corresponding to the 100x100 mask
    const sx = Math.max(0, Math.round((MASK_LEFT - imgPos.x) / scale));
    const sy = Math.max(0, Math.round((MASK_TOP - imgPos.y) / scale));
    const sSize = Math.round(MASK / scale);

    const img = new window.Image();
    img.src = preview;
    await new Promise<void>((resolve, reject) => {
      if (img.complete) resolve();
      else {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      }
    });

    const OUT = 400;
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      handleClose();
      return;
    }
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUT, OUT);

    const mime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), mime, 0.92),
    );
    const croppedFile = new File(
      [blob],
      file.name.replace(/\.(png|jpe?g)$/i, '') + '-cropped.' + (mime === 'image/jpeg' ? 'jpg' : 'png'),
      { type: mime },
    );

    if (onApply) onApply({ file: croppedFile, size: zoom });
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
              className="flex flex-col items-center"
              style={{
                padding: '24px 28px 22px',
                border: '1.5px dashed #B5BCC4',
                borderRadius: '8px',
                background: '#F4F6F9',
                position: 'relative',
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
                {MASK} × {MASK}px
              </div>

              <div
                style={{
                  position: 'relative',
                  width: `${CONTAINER}px`,
                  height: `${CONTAINER}px`,
                  background: '#FFFFFF',
                  border: '1px solid #D7D7D7',
                  overflow: 'hidden',
                  userSelect: 'none',
                  cursor: dragging ? 'grabbing' : 'grab',
                  marginBottom: '18px',
                }}
                onMouseDown={onImgMouseDown}
              >
                {preview && natural.w > 0 && (
                  <img
                    src={preview}
                    alt="Logo"
                    draggable={false}
                    style={{
                      position: 'absolute',
                      left: imgPos.x,
                      top: imgPos.y,
                      width: dw,
                      height: dh,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  />
                )}
                {/* Hidden loader to read natural dimensions */}
                {preview && !natural.w && (
                  <img
                    src={preview}
                    alt=""
                    onLoad={(e) => {
                      const t = e.currentTarget;
                      setNatural({ w: t.naturalWidth, h: t.naturalHeight });
                    }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  />
                )}

                {/* Dark overlay outside mask */}
                {natural.w > 0 && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: CONTAINER,
                        height: MASK_TOP,
                        background: 'rgba(16, 44, 74, 0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: MASK_TOP + MASK,
                        width: CONTAINER,
                        height: CONTAINER - MASK_TOP - MASK,
                        background: 'rgba(16, 44, 74, 0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: MASK_TOP,
                        width: MASK_LEFT,
                        height: MASK,
                        background: 'rgba(16, 44, 74, 0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: MASK_LEFT + MASK,
                        top: MASK_TOP,
                        width: CONTAINER - MASK_LEFT - MASK,
                        height: MASK,
                        background: 'rgba(16, 44, 74, 0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Fixed mask frame */}
                    <div
                      style={{
                        position: 'absolute',
                        left: MASK_LEFT,
                        top: MASK_TOP,
                        width: MASK,
                        height: MASK,
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 0 0 1px rgba(16, 44, 74, 0.35)',
                        pointerEvents: 'none',
                      }}
                    />
                  </>
                )}
              </div>

              <div
                style={{
                  color: '#66717D',
                  fontSize: '14px',
                  marginBottom: '10px',
                  alignSelf: 'stretch',
                }}
              >
                Manage Size
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="logo-size-slider"
                style={{
                  width: '100%',
                  accentColor: '#0E519B',
                }}
              />
              <div
                className="flex items-center justify-between"
                style={{ marginTop: '14px', alignSelf: 'stretch' }}
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
              backgroundColor: '#0E519B',
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
