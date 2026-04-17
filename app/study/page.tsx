'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Check, CloudUpload, FileDown, History, FileSpreadsheet } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Association = {
  id: string;
  associationName: string;
  address: string;
};

const SUMMARY_ROWS: {
  leftLabel: string;
  leftSuffix: string;
  rightLabel: string;
  rightSuffix: string;
}[] = [
  {
    leftLabel: 'Total Number of Housing Units',
    leftSuffix: 'N',
    rightLabel: 'Beginning Fiscal Year of the Report',
    rightSuffix: 'Y',
  },
  {
    leftLabel: 'Beginning Reserve Funds (Dollar Amount)',
    leftSuffix: '$',
    rightLabel: 'Number of Years Covered in the Report',
    rightSuffix: 'Y',
  },
  {
    leftLabel: 'SIRS Reserve Funds (Dollar Amount)',
    leftSuffix: '$',
    rightLabel: 'Suggested Rate of Return on Investments',
    rightSuffix: '%',
  },
  {
    leftLabel: 'Inflation Rate Used in the Report',
    leftSuffix: '%',
    rightLabel: 'Total Annual Reserve Budget',
    rightSuffix: '$',
  },
  {
    leftLabel: 'Average Monthly Fee per Unit',
    leftSuffix: '$',
    rightLabel: 'Total Annual Operating Budget',
    rightSuffix: '$',
  },
];

const ITEMS = [
  { no: '01', name: 'Asphalt Mill and Overlay (Resurface)', expected: 25, remaining: 25, cost: '$15072' },
  { no: '02', name: 'Balcony, Seal/Repair Conc., Resecure Raili,...', expected: 15, remaining: 15, cost: '$5072' },
  { no: '03', name: 'Ceramic and/or Porcelain Tile Flooring', expected: 25, remaining: 25, cost: '$31040' },
  { no: '01', name: 'Concrete, Flatwork Repairs', expected: 10, remaining: 10, cost: '$6318' },
  { no: '02', name: 'Cooling Tower, Galvanized, Blow Through...', expected: 20, remaining: 20, cost: '$5000' },
  { no: '03', name: 'Corridor Renovations (allowance per SF o...', expected: 20, remaining: 20, cost: '375422' },
  { no: '01', name: 'DW Packaged Booster Pump, Simplex - 7...', expected: 25, remaining: 25, cost: '$2950' },
  { no: '02', name: 'Elevator, Hydraulic, Cab Doors', expected: 10, remaining: 10, cost: '$1646' },
  { no: '03', name: 'Elevator, Hydraulic, Cabs - Refurbish', expected: 20, remaining: 20, cost: '$0491' },
  { no: '03', name: 'Elevator, Hydraulic, Main Ram & Pump Ass..', expected: 20, remaining: 20, cost: '23499' },
];

export default function StudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modelName, setModelName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectAssocOpen, setSelectAssocOpen] = useState(false);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [selectedAssocId, setSelectedAssocId] = useState<string>('');
  const [assocLoading, setAssocLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchParams.get('selectAssociation') === '1') {
      setSelectAssocOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectAssocOpen) return;
    let cancelled = false;
    setAssocLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/associations', { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        const list = (data.associations || []).map((a: any) => ({
          id: a.id,
          associationName: a.associationName,
          address: [a.address1, a.address2, a.city, a.state, a.zipCode]
            .filter(Boolean)
            .join(', '),
        }));
        setAssociations(list);
        if (list.length > 0) setSelectedAssocId(list[0].id);
      } finally {
        if (!cancelled) setAssocLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectAssocOpen]);

  const handleConfirmAssociation = () => {
    setSelectAssocOpen(false);
    router.replace('/study', { scroll: false });
  };

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader role="Property Manager" />

      {/* Page body */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1242px',
          paddingTop: '32px',
          paddingBottom: '60px',
        }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center"
          style={{
            gap: '12px',
            marginBottom: '28px',
            flexWrap: 'nowrap',
            width: '100%',
            minWidth: 0,
          }}
        >
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter a unique name for your model"
            className="h-11"
            style={{
              flex: '1 1 180px',
              minWidth: '140px',
              borderColor: '#D7D7D7',
              borderRadius: '7px',
              fontSize: '15px',
            }}
          />

          <button
            type="button"
            className="flex items-center"
            style={{
              gap: '10px',
              padding: '11px 16px',
              border: '1.5px solid #0E519B',
              borderRadius: '7px',
              background: '#F1F6FC',
              color: '#0E519B',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <CloudUpload className="w-5 h-5" />
            Upload Existing Study
          </button>

          <span style={{ color: '#102C4A', fontSize: '15px', flexShrink: 0 }}>Or</span>

          <button
            type="button"
            className="flex items-center"
            style={{
              gap: '10px',
              padding: '11px 16px',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              background: '#fff',
              color: '#102C4A',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <FileDown className="w-5 h-5" style={{ color: '#102C4A' }} />
            Download Template
          </button>

          <button
            type="button"
            className="flex items-center"
            style={{
              gap: '10px',
              padding: '11px 16px',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              background: '#fff',
              color: '#102C4A',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <CloudUpload className="w-5 h-5" style={{ color: '#102C4A' }} />
            Upload Document
          </button>

          <button
            type="button"
            className="flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              background: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <FileSpreadsheet className="w-5 h-5" style={{ color: '#102C4A' }} />
          </button>

          <button
            type="button"
            className="flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              background: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <History className="w-5 h-5" style={{ color: '#102C4A' }} />
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '11px 22px',
              border: '1px solid #D7D7D7',
              borderRadius: '7px',
              background: '#fff',
              color: '#102C4A',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              marginLeft: 'auto',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            style={{
              padding: '11px 22px',
              border: 'none',
              borderRadius: '7px',
              background: '#1F2A44',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Save Study
          </button>
        </div>

        {/* Summary table */}
        <div
          className="bg-white"
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '40px',
          }}
        >
          {SUMMARY_ROWS.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr 1.2fr 0.8fr',
                borderBottom:
                  idx === SUMMARY_ROWS.length - 1 ? 'none' : '1px solid #E5E7EB',
              }}
            >
              <div
                style={{
                  padding: '18px 24px',
                  borderRight: '1px solid #E5E7EB',
                  color: '#102C4A',
                  fontSize: '15px',
                }}
              >
                {row.leftLabel}
              </div>
              <div
                className="flex items-center justify-end"
                style={{
                  padding: '12px 18px',
                  borderRight: '1px solid #E5E7EB',
                  color: '#66717D',
                  fontSize: '15px',
                  gap: '10px',
                }}
              >
                <input
                  type="text"
                  style={{
                    flex: 1,
                    height: '32px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '15px',
                    color: '#102C4A',
                    textAlign: 'right',
                  }}
                />
                <span style={{ color: '#66717D', fontSize: '15px' }}>{row.leftSuffix}</span>
              </div>
              <div
                style={{
                  padding: '18px 24px',
                  borderRight: '1px solid #E5E7EB',
                  color: '#102C4A',
                  fontSize: '15px',
                }}
              >
                {row.rightLabel}
              </div>
              <div
                className="flex items-center justify-end"
                style={{
                  padding: '12px 18px',
                  color: '#66717D',
                  fontSize: '15px',
                  gap: '10px',
                }}
              >
                <input
                  type="text"
                  style={{
                    flex: 1,
                    height: '32px',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '15px',
                    color: '#102C4A',
                    textAlign: 'right',
                  }}
                />
                <span style={{ color: '#66717D', fontSize: '15px' }}>{row.rightSuffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Items header */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}
        >
          <h2
            className="font-semibold"
            style={{ color: '#102C4A', fontSize: '20px' }}
          >
            234 Items Founded
          </h2>
          <Input
            placeholder="Search by name"
            className="h-11"
            style={{
              width: '280px',
              borderColor: '#D7D7D7',
              borderRadius: '7px',
              fontSize: '15px',
            }}
          />
        </div>

        {/* Items table */}
        <div
          className="bg-white"
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 120px 1.6fr 130px 130px 150px 1fr 50px',
              padding: '16px 20px',
              borderBottom: '1px solid #E5E7EB',
              background: '#fff',
            }}
          >
            {['No.', 'Type', 'Name', 'Expected Life', 'Remaining Life', 'Replacement Cost', 'Comment', ''].map(
              (h) => (
                <span
                  key={h}
                  style={{ color: '#102C4A', fontSize: '14px', fontWeight: 600 }}
                >
                  {h}
                </span>
              )
            )}
          </div>

          {ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 120px 1.6fr 130px 130px 150px 1fr 50px',
                padding: '14px 20px',
                borderBottom: i === ITEMS.length - 1 ? 'none' : '1px solid #F1F2F4',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#102C4A', fontSize: '14px' }}>{item.no}</span>
              <div>
                <Select defaultValue="sirs">
                  <SelectTrigger
                    style={{
                      height: '36px',
                      width: '86px',
                      borderColor: '#D7D7D7',
                      borderRadius: '6px',
                      fontSize: '14px',
                             padding: '0 16px',
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sirs">SIRS</SelectItem>
                    <SelectItem value="non-sirs">Non-SIRS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span
                style={{
                  color: '#102C4A',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: '12px',
                }}
              >
                {item.name}
              </span>
              <span style={{ color: '#102C4A', fontSize: '14px' }}>{item.expected}</span>
              <span style={{ color: '#102C4A', fontSize: '14px' }}>{item.remaining}</span>
              <span style={{ color: '#102C4A', fontSize: '14px' }}>{item.cost}</span>
              <input
                type="text"
                placeholder="Type here"
                style={{
                  width: '100%',
                  height: '32px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  color: '#102C4A',
                }}
              />
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#66717D',
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}
              >
                •••
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Select Association popup */}
      {mounted && selectAssocOpen &&
        createPortal(
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
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}>
                <h2
                  className="font-semibold"
                  style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3 }}
                >
                  Select Association
                </h2>
              </div>

              {/* Body */}
              <div style={{ padding: '28px 32px 24px' }}>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '24px' }}>
                  Choose the association you want to upload a reserve study for.
                </p>

                {/* Dynamic association list — same step-row pattern as "Choose for next step" */}
                {assocLoading ? (
                  <div style={{ color: '#66717D', fontSize: '16px', marginBottom: '28px' }}>
                    Loading…
                  </div>
                ) : associations.length === 0 ? (
                  <div style={{ color: '#66717D', fontSize: '16px', marginBottom: '28px' }}>
                    No associations found. Please create one first.
                  </div>
                ) : (
                  <div
                    className="thin-scrollbar"
                    style={{ maxHeight: '360px', overflowY: 'auto', marginBottom: '28px' }}
                  >
                    {associations.map((a, idx) => {
                      const isSelected = a.id === selectedAssocId;
                      const isLast = idx === associations.length - 1;
                      return (
                        <div key={a.id}>
                          <div
                            className="flex items-center"
                            style={{ gap: '20px', marginBottom: '20px', cursor: 'pointer' }}
                            onClick={() => setSelectedAssocId(a.id)}
                          >
                            {/* Numbered circle — mirrors dashboard step circles exactly */}
                            <div
                              className="flex items-center justify-center shrink-0"
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '9999px',
                                border: isSelected ? '1.5px solid #0E519B' : '1px solid #D7D7D7',
                                background: isSelected ? '#0E519B' : 'transparent',
                                color: isSelected ? '#FFFFFF' : '#102C4A',
                                fontSize: '16px',
                                fontWeight: 500,
                                flexShrink: 0,
                                transition: 'all 150ms',
                              }}
                            >
                              {String(idx + 1).padStart(2, '0')}
                            </div>

                            {/* Association name + address */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p
                                style={{
                                  color: '#102C4A',
                                  fontSize: '16px',
                                  fontWeight: isSelected ? 600 : 400,
                                  lineHeight: 1.5,
                                  margin: 0,
                                  marginBottom: a.address ? '2px' : 0,
                                }}
                              >
                                {a.associationName}
                              </p>
                              {a.address && (
                                <p style={{ color: '#66717D', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                                  {a.address}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Divider between rows — same as dashboard */}
                          {!isLast && (
                            <div style={{ height: '1px', background: '#E5E7EB', margin: '0 0 20px' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* CTA — same style as "Invite {roleLabel}" button */}
                <button
                  type="button"
                  onClick={handleConfirmAssociation}
                  disabled={!selectedAssocId}
                  className="w-full flex items-center justify-center font-semibold text-white transition-all duration-200 hover:opacity-95"
                  style={{
                    backgroundColor: selectedAssocId ? '#0E519B' : '#B5BCC4',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    gap: '10px',
                    border: 'none',
                    cursor: selectedAssocId ? 'pointer' : 'not-allowed',
                  }}
                >
                  Upload Reserve Study
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
