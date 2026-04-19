'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type OrgItem = {
  id: string;
  name: string;
  roleLabel: string;
  companyType: string;
  kind: 'self' | 'invite';
  logoFileId: string | null;
};

type OrgContextValue = {
  orgs: OrgItem[];
  orgsLoaded: boolean;
  selectedOrgId: string;
  selectedOrg: OrgItem | undefined;
  setSelectedOrgId: (id: string) => void;
  isSelfOrg: boolean;
};

const SELECTED_ORG_KEY = 'rf-selected-org-id';

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgs, setOrgs] = useState<OrgItem[]>([]);
  const [orgsLoaded, setOrgsLoaded] = useState(false);
  const [selectedOrgId, setSelectedOrgIdState] = useState<string>('self');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/orgs/mine')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list: OrgItem[] = Array.isArray(data?.orgs) ? data.orgs : [];
        setOrgs(list);
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(SELECTED_ORG_KEY);
          if (stored && list.some((o) => o.id === stored)) {
            setSelectedOrgIdState(stored);
          } else {
            setSelectedOrgIdState('self');
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setOrgsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setSelectedOrgId = useCallback((id: string) => {
    setSelectedOrgIdState(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SELECTED_ORG_KEY, id);
    }
  }, []);

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId) || orgs[0];
  const isSelfOrg = (selectedOrg?.id ?? selectedOrgId) === 'self';

  const value: OrgContextValue = {
    orgs,
    orgsLoaded,
    selectedOrgId,
    selectedOrg,
    setSelectedOrgId,
    isSelfOrg,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within an OrgProvider');
  return ctx;
}
