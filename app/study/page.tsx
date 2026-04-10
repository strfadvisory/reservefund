'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CloudUpload,
  FileDown,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [modelName, setModelName] = useState('');

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
    </div>
  );
}
