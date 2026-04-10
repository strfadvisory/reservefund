'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CloudUpload, MoreHorizontal } from 'lucide-react';
import { UploadReserveStudyModal } from '@/components/upload-reserve-study-modal';

const STUDIES = [
  'Association Reserve Study',
  'Community Reserve Study',
  'Property Reserve Study',
  'HOA Reserve Study Report',
];

export default function UploadReserveStudyPage() {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleConfirm = () => {
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - fixed width, always on the left */}
      <aside
        className="relative shrink-0 hidden md:block"
        style={{
          width: '353px',
          backgroundImage: "url('/images/leftbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ paddingTop: '40px', paddingLeft: '40px' }}>
          <Image
            src="/images/logo.png"
            alt="Reserve Fund Advisers LLC"
            width={200}
            height={56}
            priority
            style={{ height: 'auto', width: '200px' }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-auto relative">
        <div className="flex-1 flex justify-center items-center py-12 px-6">
          <div
            className="w-full flex flex-col my-auto"
            style={{ maxWidth: '643px' }}
          >
            {/* Form Card */}
            <div
              className="bg-white"
              style={{
                border: '1px solid #D7D7D7',
                borderRadius: '7px',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '24px 32px',
                  borderBottom: '1px solid #D7D7D7',
                }}
              >
                <h1
                  className="font-semibold"
                  style={{
                    color: '#102C4A',
                    fontSize: '24px',
                    lineHeight: 1.3,
                  }}
                >
                  Upload Reserve Study Data
                </h1>
              </div>

              {/* Description + Upload button */}
              <div
                style={{
                  padding: '24px 32px 28px',
                  borderBottom: '1px solid #D7D7D7',
                }}
              >
                <p
                  className="text-center"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                  }}
                >
                  You can upload Reserve Study data in multiple ways—add your
                  existing data or download the template and upload it for the
                  study.
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="flex items-center"
                    style={{
                      gap: '10px',
                      padding: '12px 28px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '7px',
                      background: '#fff',
                      color: '#102C4A',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <CloudUpload
                      className="w-5 h-5"
                      style={{ color: '#102C4A' }}
                    />
                    Upload Study
                  </button>
                </div>
              </div>

              {/* Studies list */}
              <div style={{ padding: '24px 32px 8px' }}>
                <h2
                  className="font-semibold"
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    marginBottom: '20px',
                  }}
                >
                  5 Reserve Study Founded
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                    marginBottom: '8px',
                  }}
                >
                  {STUDIES.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                      style={{ gap: '12px' }}
                    >
                      <span
                        style={{
                          color: '#102C4A',
                          fontSize: '16px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {name}
                      </span>
                      <button
                        type="button"
                        className="flex items-center justify-center"
                        style={{
                          flexShrink: 0,
                          width: '28px',
                          height: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#66717D',
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm */}
              <div
                style={{
                  padding: '24px 32px',
                  borderTop: '1px solid #D7D7D7',
                }}
              >
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
              </div>

              {/* Skip for now */}
              <div
                className="text-center"
                style={{
                  padding: '20px',
                  borderTop: '1px solid #D7D7D7',
                }}
              >
                <button
                  type="button"
                  onClick={handleSkip}
                  style={{
                    color: '#102C4A',
                    fontSize: '16px',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Footer (outside the card) */}
            <div style={{ marginTop: '32px' }}>
              <div className="flex justify-between items-start">
                <div
                  className="flex flex-col gap-2"
                  style={{ color: '#66717D', fontSize: '14px' }}
                >
                  <a
                    href="mailto:info@reservefundadvisory.com"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <span>@</span> info@reservefundadvisory.com
                  </a>
                  <a
                    href="tel:727-788-4800"
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <span>☎</span> 727-788-4800
                  </a>
                </div>
                <div
                  className="flex flex-col items-end gap-2"
                  style={{ color: '#66717D', fontSize: '14px', textAlign: 'right' }}
                >
                  <Link href="/privacy">Privacy Policy</Link>
                  <span>Copyright2026 @ reservefundadvisory.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UploadReserveStudyModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={() => router.push('/study')}
      />
    </div>
  );
}
