'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Plus, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { Toast } from '@/components/toast';
import * as XLSX from 'xlsx';

type StudyItem = {
  no: string;
  name: string;
  expected: number | string;
  remaining: number | string;
  cost: string;
  sirs?: string;
  comment?: string;
};

type Study = {
  id: string;
  modelName: string;
  associationId?: string | null;
  housingUnits?: string | null;
  beginningReserveFunds?: string | null;
  sirsReserveFunds?: string | null;
  inflationRate?: string | null;
  averageMonthlyFee?: string | null;
  beginningFiscalYear?: string | null;
  yearsCovered?: string | null;
  rateOfReturn?: string | null;
  annualReserveBudget?: string | null;
  annualOperatingBudget?: string | null;
  items: StudyItem[];
  isBlocked?: boolean;
  createdAt: string;
};

type Association = {
  id: string;
  associationName: string;
  address?: string;
};

function fmt(val?: string | null, prefix = '', suffix = '') {
  if (!val) return null;
  return `${prefix}${val}${suffix}`;
}

function studySummaryLine1(s: Study) {
  return [
    fmt(s.housingUnits, '', ' Units'),
    fmt(s.beginningReserveFunds, '$', 'K Reserve'),
    fmt(s.sirsReserveFunds, '$', 'K SIRS'),
    fmt(s.inflationRate, '', '% Inflation'),
    fmt(s.averageMonthlyFee, '$', '/mo'),
  ].filter(Boolean).join(' | ') || '—';
}

function studySummaryLine2(s: Study) {
  return [
    fmt(s.beginningFiscalYear, 'FY '),
    fmt(s.yearsCovered, '', ' Years'),
    fmt(s.rateOfReturn, '', '% ROI'),
    fmt(s.annualReserveBudget, '$', 'K Reserve Budget'),
    fmt(s.annualOperatingBudget, '$', 'K Operating'),
  ].filter(Boolean).join(' | ') || '—';
}

function downloadStudyAsXlsx(s: Study, assocName: string) {
  const settings = [
    ['Field', 'Value'],
    ['Model Name', s.modelName],
    ['Association', assocName],
    ['Total Number of Housing Units', s.housingUnits ?? ''],
    ['Beginning Reserve Funds (Dollar Amount)', s.beginningReserveFunds ?? ''],
    ['SIRS Reserve Funds (Dollar Amount)', s.sirsReserveFunds ?? ''],
    ['Inflation Rate Used in the Report', s.inflationRate ?? ''],
    ['Average Monthly Fee per Unit', s.averageMonthlyFee ?? ''],
    ['Beginning Fiscal Year of the Report', s.beginningFiscalYear ?? ''],
    ['Number of Years Covered in the Report', s.yearsCovered ?? ''],
    ['Suggested Rate of Return on Investments', s.rateOfReturn ?? ''],
  ];

  const items = [
    ['No.', 'Item Name', 'Expected Life', 'Remaining Life', 'Replacement Cost', 'Sirs', 'Comment'],
    ...s.items.map((it, i) => [
      String(i + 1).padStart(2, '0'),
      it.name,
      it.expected,
      it.remaining,
      it.cost,
      it.sirs === '1' ? 'Non-SIRS' : 'SIRS',
      it.comment ?? '',
    ]),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settings), 'Settings');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(items), 'Items');
  XLSX.writeFile(wb, `${s.modelName.replace(/\s+/g, '_')}.xlsx`);
}

export default function ReserveStudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssocId, setActiveAssocId] = useState<string | null>(null);
  const [assocQuery, setAssocQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; studyId: string; studyName: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAll();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [studyRes, assocRes] = await Promise.all([
        fetch('/api/studies'),
        fetch('/api/associations'),
      ]);
      const studyData = await studyRes.json();
      const assocData = await assocRes.json();
      const list: Study[] = studyData.studies ?? [];
      const assocs: Association[] = assocData.associations ?? [];
      setStudies(list);
      setAssociations(assocs);
      if (assocs.length > 0) setActiveAssocId(assocs[0].id);
    } catch {
      setToast({ message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getAssoc = (id?: string | null) => associations.find((a) => a.id === id);

  const filteredAssocs = associations.filter((a) =>
    a.associationName.toLowerCase().includes(assocQuery.toLowerCase()),
  );

  const activeAssoc = associations.find((a) => a.id === activeAssocId);
  const assocStudies = studies.filter((s) => s.associationId === activeAssocId);

  const handleDownload = (s: Study) => {
    const assocName = getAssoc(s.associationId)?.associationName ?? '';
    downloadStudyAsXlsx(s, assocName);
    setOpenMenuId(null);
  };

  const handleEditData = (s: Study) => {
    setOpenMenuId(null);
    router.push(`/study?studyId=${s.id}`);
  };

  const handleMakeCopy = async (s: Study) => {
    setOpenMenuId(null);
    try {
      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: `${s.modelName} (Copy)`,
          associationId: s.associationId,
          formData: {
            housingUnits: s.housingUnits,
            beginningReserveFunds: s.beginningReserveFunds,
            sirsReserveFunds: s.sirsReserveFunds,
            inflationRate: s.inflationRate,
            averageMonthlyFee: s.averageMonthlyFee,
            beginningFiscalYear: s.beginningFiscalYear,
            yearsCovered: s.yearsCovered,
            rateOfReturn: s.rateOfReturn,
            annualReserveBudget: s.annualReserveBudget,
            annualOperatingBudget: s.annualOperatingBudget,
          },
          items: s.items,
        }),
      });
      if (!res.ok) throw new Error('Copy failed');
      setToast({ message: 'Study copied successfully', type: 'success' });
      fetchAll();
    } catch {
      setToast({ message: 'Failed to copy study', type: 'error' });
    }
  };

  const handleBlock = async (s: Study) => {
    setOpenMenuId(null);
    try {
      const res = await fetch('/api/studies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: s.id, isBlocked: !s.isBlocked }),
      });
      if (!res.ok) throw new Error('Block toggle failed');
      const { study: updated } = await res.json();
      setStudies((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
      setToast({
        message: `"${s.modelName}" has been ${updated.isBlocked ? 'blocked' : 'unblocked'}`,
        type: 'success',
      });
    } catch {
      setToast({ message: 'Failed to update study', type: 'error' });
    }
  };

  const handleRemove = (s: Study) => {
    setOpenMenuId(null);
    setConfirmDialog({ open: true, studyId: s.id, studyName: s.modelName });
  };

  const confirmRemove = async () => {
    if (!confirmDialog) return;
    try {
      const res = await fetch(`/api/studies?id=${confirmDialog.studyId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setStudies((prev) => prev.filter((x) => x.id !== confirmDialog.studyId));
      setToast({ message: 'Study removed', type: 'success' });
    } catch {
      setToast({ message: 'Failed to remove study', type: 'error' });
    } finally {
      setConfirmDialog(null);
    }
  };

  const MENU_ITEMS = (s: Study) => [
    { label: 'Download',    action: () => handleDownload(s) },
    { label: 'Edit Data',   action: () => handleEditData(s) },
    { label: 'Make a Copy', action: () => handleMakeCopy(s) },
    { label: s.isBlocked ? 'Unblock' : 'Block', action: () => handleBlock(s), color: s.isBlocked ? '#16A34A' : '#F59E0B' },
    { label: 'Remove',      action: () => handleRemove(s), color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9', paddingTop: '64px' }}>
      <DashboardHeader />

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(270deg, #083464 0%, #0E519B 100%)',
          paddingTop: '24px',
          paddingBottom: '104px',
        }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{ maxWidth: '1242px', padding: '0 24px' }}
        >
          <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 600, margin: 0 }}>
            <span>{loading ? '—' : studies.length}</span>{' '}
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
              Reserve {studies.length === 1 ? 'Study' : 'Studies'} Founded
            </span>
          </h1>
          <button
            type="button"
            onClick={() => router.push('/study?selectAssociation=1')}
            className="flex items-center"
            style={{
              gap: '6px',
              background: '#0E59B0',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: '7px',
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Add New
          </button>
        </div>
      </div>

      {/* Content card */}
      <div
        className="mx-auto"
        style={{ maxWidth: '1242px', padding: '0 24px 48px', marginTop: '-80px' }}
      >
        <div
          className="bg-white"
          style={{
            border: '1px solid #D7D7D7',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: '310px 1fr',
            overflow: 'hidden',
            minHeight: '780px',
          }}
        >
          {/* Left: association list */}
          <aside style={{ borderRight: '1px solid #D7D7D7' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F2F4' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  className="w-4 h-4"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#66717D' }}
                />
                <input
                  value={assocQuery}
                  onChange={(e) => setAssocQuery(e.target.value)}
                  placeholder="Search by name"
                  style={{
                    width: '100%', height: '40px', borderRadius: '7px',
                    border: '1px solid #D7D7D7', background: '#FFFFFF',
                    paddingLeft: '36px', paddingRight: '12px',
                    fontSize: '14px', color: '#102C4A', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: 'calc(780px - 73px)' }} className="thin-scrollbar">
              {loading ? (
                <div style={{ padding: '20px', color: '#66717D', fontSize: '14px' }}>Loading...</div>
              ) : filteredAssocs.length === 0 ? (
                <div style={{ padding: '20px', color: '#66717D', fontSize: '14px' }}>No associations found.</div>
              ) : (
                filteredAssocs.map((a) => {
                  const isActive = a.id === activeAssocId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setActiveAssocId(a.id)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '16px 20px',
                        borderBottom: '1px solid #F1F2F4',
                        background: isActive ? '#F1F4F9' : '#FFFFFF',
                        cursor: 'pointer', border: 'none',
                        borderBottom: '1px solid #F1F2F4',
                        borderLeft: isActive ? '3px solid #0E519B' : '3px solid transparent',
                      }}
                    >
                      <div style={{ color: '#102C4A', fontSize: '14px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.35 }}>
                        {a.associationName}
                      </div>
                      {a.address && (
                        <div style={{ color: '#66717D', fontSize: '12px', lineHeight: 1.5 }}>{a.address}</div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right: studies for selected association */}
          <section style={{ padding: '24px 28px', overflowY: 'auto' }}>
            <h2 style={{ color: '#102C4A', fontSize: '18px', fontWeight: 600, margin: '0 0 20px' }}>
              {assocStudies.length} {assocStudies.length === 1 ? 'Study' : 'Study'} Founded
            </h2>

            {loading ? (
              <div style={{ color: '#66717D', fontSize: '14px' }}>Loading...</div>
            ) : assocStudies.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px', textAlign: 'center',
                  color: '#9CA3AF', fontSize: '14px',
                  border: '1px dashed #D7D7D7', borderRadius: '7px',
                }}
              >
                No studies found for <strong style={{ color: '#66717D' }}>{activeAssoc?.associationName}</strong>.
                <br />
                <button
                  type="button"
                  onClick={() => router.push(`/study?selectAssociation=1&associationId=${activeAssocId}`)}
                  style={{ marginTop: '12px', color: '#0E519B', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  + Add a study
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assocStudies.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      border: '1px solid #E6E8EC', borderRadius: '7px',
                      padding: '16px 20px', background: '#FFFFFF',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: '16px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#102C4A', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                        {s.modelName}
                      </div>
                      <div style={{ color: '#66717D', fontSize: '13px', lineHeight: 1.6 }}>
                        {studySummaryLine1(s)}
                      </div>
                      <div style={{ color: '#66717D', fontSize: '13px', lineHeight: 1.6 }}>
                        {studySummaryLine2(s)}
                      </div>
                    </div>

                    <div className="flex items-center" style={{ gap: '12px', flexShrink: 0 }}>
                      <span style={{ color: s.isBlocked ? '#EF4444' : '#16A34A', fontSize: '13px', fontWeight: 500 }}>
                        {s.isBlocked ? 'Blocked' : 'Active'}
                      </span>

                      {/* 3-dot menu */}
                      <div style={{ position: 'relative' }} ref={openMenuId === s.id ? menuRef : undefined}>
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                          style={{
                            background: openMenuId === s.id ? '#F1F4F9' : 'none',
                            border: 'none', cursor: 'pointer', color: '#66717D',
                            padding: '6px', display: 'flex', alignItems: 'center',
                            borderRadius: '6px',
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openMenuId === s.id && (
                          <div
                            style={{
                              position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                              background: '#FFFFFF',
                              border: '1px solid #E6E8EC',
                              borderRadius: '7px',
                              boxShadow: '0 8px 24px rgba(16,44,74,0.12)',
                              zIndex: 50,
                              minWidth: '160px',
                              overflow: 'hidden',
                            }}
                          >
                            {MENU_ITEMS(s).map((item, idx, arr) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={item.action}
                                style={{
                                  display: 'block', width: '100%', textAlign: 'left',
                                  padding: '11px 16px',
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  color: item.color ?? '#102C4A',
                                  background: 'none', border: 'none',
                                  borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #F1F2F4',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#F6F7F9')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {confirmDialog?.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setConfirmDialog(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '7px',
              border: '1px solid #D7D7D7',
              boxShadow: '0 20px 60px rgba(16, 44, 74, 0.16)',
              maxWidth: '420px',
              width: '90%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#102C4A', fontSize: '18px', fontWeight: 600 }}>
                Remove Study
              </h3>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#66717D',
                  padding: '4px',
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p style={{ color: '#66717D', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
              Are you sure you want to remove <strong style={{ color: '#102C4A' }}>"{confirmDialog.studyName}"</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '7px',
                  border: '1px solid #D7D7D7',
                  background: '#FFFFFF',
                  color: '#102C4A',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                style={{
                  padding: '10px 20px',
                  borderRadius: '7px',
                  border: 'none',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
