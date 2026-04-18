'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PendingInviteAssociation = {
  id: string;
  associationName: string;
  city: string | null;
  managerFirstName: string | null;
  managerLastName: string | null;
};

export type PendingInvite = {
  id: string;
  createdAt: string;
  inviter: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    companyName: string | null;
    roleLabel: string;
  } | null;
  inviterAssociations: PendingInviteAssociation[];
};

type Phase = 'choose' | 'pickAssociation';

export function PendingInviteModal({
  invites,
  onAllResolved,
}: {
  invites: PendingInvite[];
  onAllResolved: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const current = invites[index];

  if (!mounted || !current) return null;

  const advance = () => {
    setPhase('choose');
    setSelectedAssociationId(null);
    setError('');
    if (index + 1 >= invites.length) {
      onAllResolved();
    } else {
      setIndex(index + 1);
    }
  };

  const submitResponse = async (body: { action: 'accept' | 'deny'; associationId?: string }) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/invite/${current.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      advance();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = () => setPhase('pickAssociation');
  const handleDeny = () => submitResponse({ action: 'deny' });
  const handleConfirmAssociation = () => {
    if (!selectedAssociationId) return;
    submitResponse({ action: 'accept', associationId: selectedAssociationId });
  };

  const inviterFullName = current.inviter
    ? [current.inviter.firstName, current.inviter.lastName].filter(Boolean).join(' ') || current.inviter.email
    : 'Someone';
  const companyName = current.inviter?.companyName || 'their organization';
  const roleLabel = current.inviter?.roleLabel || 'team member';
  const counter = invites.length > 1 ? `${index + 1} of ${invites.length}` : null;
  const hasAssociations = current.inviterAssociations.length > 0;

  return createPortal(
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
        zIndex: 1100,
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="bg-white"
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
          className="flex items-center justify-between"
          style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}
        >
          <h2 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3 }}>
            {phase === 'choose' ? 'Invitation Request' : 'Choose Association'}
          </h2>
          {counter && (
            <span style={{ color: '#66717D', fontSize: '14px' }}>{counter}</span>
          )}
        </div>

        {phase === 'choose' && (
          <div style={{ padding: '28px 32px' }}>
            <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '24px' }}>
              <strong>{inviterFullName}</strong> from <strong>{companyName}</strong> has invited you to join as{' '}
              <strong>{roleLabel}</strong>.
            </p>
            {error && (
              <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
            )}
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              <button
                type="button"
                onClick={handleDeny}
                disabled={submitting}
                className="font-semibold transition-all duration-200 hover:bg-gray-50"
                style={{
                  background: '#fff',
                  border: '1px solid #D7D7D7',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  color: '#102C4A',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                Deny
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={submitting}
                className="font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  backgroundColor: submitting ? '#9CA3AF' : '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {phase === 'pickAssociation' && (
          <div style={{ padding: '28px 32px' }}>
            {!hasAssociations ? (
              <>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '24px' }}>
                  This user has no associations yet. You can respond to this invitation later.
                </p>
                <button
                  type="button"
                  onClick={advance}
                  className="w-full font-semibold text-white"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '16px' }}>
                  Select which association you&apos;d like to join.
                </p>
                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    marginBottom: '24px',
                    maxHeight: '280px',
                    overflowY: 'auto',
                  }}
                >
                  {current.inviterAssociations.map((a, i, arr) => {
                    const selected = selectedAssociationId === a.id;
                    const subtitle =
                      [a.managerFirstName, a.managerLastName].filter(Boolean).join(' ') || a.city || '';
                    return (
                      <label
                        key={a.id}
                        className="flex items-start"
                        style={{
                          padding: '14px 20px',
                          gap: '12px',
                          borderBottom: i === arr.length - 1 ? 'none' : '1px solid #D7D7D7',
                          cursor: 'pointer',
                          background: selected ? '#F4F6F9' : '#fff',
                        }}
                      >
                        <input
                          type="radio"
                          name="pending-invite-association"
                          value={a.id}
                          checked={selected}
                          onChange={() => setSelectedAssociationId(a.id)}
                          style={{ marginTop: '4px' }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#102C4A', fontSize: '16px', fontWeight: 500 }}>
                            {a.associationName}
                          </div>
                          {subtitle && (
                            <div style={{ color: '#66717D', fontSize: '14px' }}>{subtitle}</div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {error && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
                )}
                <button
                  type="button"
                  onClick={handleConfirmAssociation}
                  disabled={!selectedAssociationId || submitting}
                  className="w-full font-semibold text-white"
                  style={{
                    backgroundColor: !selectedAssociationId || submitting ? '#9CA3AF' : '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: !selectedAssociationId || submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Saving…' : 'Confirm'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
