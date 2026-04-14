'use client';

import { ImagePlus, MoreHorizontal } from 'lucide-react';

type Member = {
  name: string;
  role: string;
  phone: string;
  email: string;
  cta: 'Edit' | 'You';
};

type Study = {
  name: string;
  uploader: string;
  lastModified: string;
  versions: string;
  status: 'Active' | 'Inactive';
};

const MEMBERS: Member[] = [
  {
    name: 'Michael Jordan',
    role: 'Director, Field Manager All Functions',
    phone: '+018483 28293',
    email: 'info@BarAssociation.com',
    cta: 'Edit',
  },
  {
    name: 'Mandra jonson',
    role: 'Members Management, Reserver Study data ,',
    phone: '+018483 28293',
    email: 'info@BarAssociation.com',
    cta: 'Edit',
  },
];

const STUDIES: Study[] = [
  {
    name: 'ABA Reserve & Compliance Study',
    uploader: 'Myself. 20 Jan 2024 8:40 PM',
    lastModified: '20 Jan 2024 8:40 PM',
    versions: '3 Founded',
    status: 'Active',
  },
  {
    name: 'ABA Reserve & Compliance Study',
    uploader: 'Myself. 20 Jan 2024 8:40 PM',
    lastModified: '20 Jan 2024 8:40 PM',
    versions: '3 Founded',
    status: 'Active',
  },
  {
    name: 'ABA Facility & Capital Reserve Study',
    uploader: 'Myself. 20 Jan 2024 8:40 PM',
    lastModified: '20 Jan 2024 8:40 PM',
    versions: '3 Founded',
    status: 'Active',
  },
];

export type AssociationDetailProps = {
  name: string;
  address: string;
  readOnly?: boolean;
  showBrandingBanner?: boolean;
  placeholderLogo?: boolean;
  onBrandingChoice?: (choice: 'yes' | 'no') => void;
};

export function AssociationDetail({
  name,
  address,
  readOnly = false,
  showBrandingBanner = false,
  placeholderLogo = false,
  onBrandingChoice,
}: AssociationDetailProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Identity + meta grid card */}
      <div
        style={{
          border: '1px solid #D7D7D7',
          borderRadius: '7px',
          overflow: 'hidden',
          background: '#FFFFFF',
        }}
      >
        {/* identity row */}
        <div
          className="flex items-start"
          style={{ padding: '20px 24px', gap: '20px' }}
        >
          {placeholderLogo ? (
            <div
              className="flex items-center justify-center"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '10px',
                flexShrink: 0,
                background: '#F1F4F9',
                border: '1px solid #ECEEF1',
              }}
            >
              <ImagePlus
                className="w-6 h-6"
                style={{ color: '#B5BCC4' }}
                strokeWidth={1.5}
              />
            </div>
          ) : (
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '10px',
                flexShrink: 0,
                background:
                  'conic-gradient(from 45deg, #F59E0B, #EF4444, #EC4899, #8B5CF6, #3B82F6, #10B981, #F59E0B)',
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                color: '#102C4A',
                fontSize: '20px',
                fontWeight: 600,
                margin: 0,
                marginBottom: '6px',
                lineHeight: 1.3,
              }}
            >
              {name}
            </h2>
            <p
              style={{
                color: '#66717D',
                fontSize: '14px',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {address}
            </p>
          </div>
          {!readOnly && (
            <button type="button" style={outlineBtn}>
              Edit
            </button>
          )}
        </div>
        {showBrandingBanner && (
          <div
            className="flex items-center justify-between"
            style={{
              margin: '0 20px 20px',
              padding: '14px 18px',
              background: '#FEF7E6',
              border: '1px solid #F6E3A1',
              borderRadius: '7px',
              gap: '16px',
            }}
          >
            <p
              style={{
                color: '#102C4A',
                fontSize: '14px',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              Do you want to leverage your personal branding and turn this application into your own branded solution?
            </p>
            <div className="flex items-center" style={{ gap: '10px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => onBrandingChoice?.('no')}
                style={outlineBtn}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => onBrandingChoice?.('yes')}
                style={outlineBtn}
              >
                Yes
              </button>
            </div>
          </div>
        )}
        {/* meta strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            borderTop: '1px solid #D7D7D7',
          }}
        >
          {[
            { label: 'Invite By', value: 'Myself' },
            { label: 'Invitation Date', value: '20 Jan 2025 8:40 PM' },
            { label: 'No. of Reserve Study', value: '3 Founded' },
          ].map((item, idx, arr) => (
            <div
              key={item.label}
              style={{
                padding: '16px 24px',
                borderRight:
                  idx === arr.length - 1 ? 'none' : '1px solid #D7D7D7',
              }}
            >
              <div
                style={{
                  color: '#66717D',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: '#102C4A',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '12px' }}
        >
          <h3
            style={{
              color: '#102C4A',
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {MEMBERS.length} Members Founded
          </h3>
          {!readOnly && (
            <button type="button" style={outlineBtn}>
              Add New
            </button>
          )}
        </div>
        <div
          style={{
            border: '1px solid #D7D7D7',
            borderRadius: '7px',
            overflow: 'hidden',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr auto',
              padding: '14px 24px',
              background: '#F6F7F9',
              borderBottom: '1px solid #D7D7D7',
              color: '#102C4A',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <span>Name</span>
            <span>Contact</span>
            <span />
          </div>
          {MEMBERS.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr auto',
                alignItems: 'center',
                padding: '18px 24px',
                gap: '16px',
                borderBottom:
                  idx === MEMBERS.length - 1 ? 'none' : '1px solid #ECEEF1',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#102C4A',
                    fontSize: '15px',
                    fontWeight: 500,
                    marginBottom: '4px',
                  }}
                >
                  {m.name}
                </div>
                <div style={{ color: '#66717D', fontSize: '13px' }}>
                  {m.role}
                </div>
              </div>
              <div>
                <div style={{ color: '#102C4A', fontSize: '14px' }}>
                  {m.phone}
                </div>
                <div style={{ color: '#66717D', fontSize: '13px' }}>
                  {m.email}
                </div>
              </div>
              {!readOnly && (
                <button type="button" style={outlineBtn}>
                  {m.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reserve Study Uploaded */}
      <div>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '12px' }}
        >
          <h3
            style={{
              color: '#102C4A',
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Reserve Study Uploaded
          </h3>
          {!readOnly && (
            <button type="button" style={outlineBtn}>
              Add New
            </button>
          )}
        </div>
        <div
          style={{
            border: '1px solid #D7D7D7',
            borderRadius: '7px',
            overflow: 'hidden',
            background: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 32px',
              padding: '14px 24px',
              background: '#F6F7F9',
              borderBottom: '1px solid #D7D7D7',
              color: '#102C4A',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <span>Name</span>
            <span>Last Modified</span>
            <span>Versions</span>
            <span />
            <span />
          </div>
          {STUDIES.map((s, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 32px',
                alignItems: 'center',
                padding: '18px 24px',
                gap: '16px',
                borderBottom:
                  idx === STUDIES.length - 1 ? 'none' : '1px solid #ECEEF1',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#102C4A',
                    fontSize: '15px',
                    fontWeight: 500,
                    marginBottom: '4px',
                  }}
                >
                  {s.name}
                </div>
                <div style={{ color: '#66717D', fontSize: '13px' }}>
                  {s.uploader}
                </div>
              </div>
              <span style={{ color: '#102C4A', fontSize: '14px' }}>
                {s.lastModified}
              </span>
              <span style={{ color: '#102C4A', fontSize: '14px' }}>
                {s.versions}
              </span>
              <span
                style={{
                  color: s.status === 'Active' ? '#12B76A' : '#66717D',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {s.status}
              </span>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#66717D',
                  padding: '4px',
                  justifySelf: 'end',
                }}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const outlineBtn: React.CSSProperties = {
  padding: '8px 18px',
  border: '1px solid #D7D7D7',
  background: '#FFFFFF',
  borderRadius: '7px',
  color: '#102C4A',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};
