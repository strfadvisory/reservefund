'use client';

import { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, CloudUpload, Download, FileDown, Plus, Search, X } from 'lucide-react';
import { AssociationPopup } from '@/components/association-popup';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toast } from '@/components/toast';
import * as XLSX from 'xlsx';

type Association = {
  id: string;
  associationName: string;
  managerFirstName?: string;
  managerLastName?: string;
  address?: string;
  logoFileId?: string;
};

type StudyItem = {
  no: string;
  name: string;
  expected: number | string;
  remaining: number | string;
  cost: string;
  comment?: string;
};

const LEFT_FIELDS: { label: string; key: string; suffix: '$' | '%' }[] = [
  { label: 'Total Number of Housing Units', key: 'housingUnits', suffix: '$' },
  { label: 'Beginning Reserve Funds (Dollar Amount)', key: 'beginningReserveFunds', suffix: '$' },
  { label: 'SIRS Reserve Funds (Dollar Amount)', key: 'sirsReserveFunds', suffix: '$' },
  { label: 'Inflation Rate Used in the Report', key: 'inflationRate', suffix: '%' },
  { label: 'Average Monthly Fee per Unit', key: 'averageMonthlyFee', suffix: '$' },
];

const RIGHT_FIELDS: { label: string; key: string; suffix: '$' | '%' }[] = [
  { label: 'Beginning Fiscal Year of the Report', key: 'beginningFiscalYear', suffix: '$' },
  { label: 'Number of Years Covered in the Report', key: 'yearsCovered', suffix: '$' },
  { label: 'Suggested Rate of Return on Investments', key: 'rateOfReturn', suffix: '$' },
  { label: 'Total Annual Reserve Budget', key: 'annualReserveBudget', suffix: '%' },
  { label: 'Total Annual Operating Budget', key: 'annualOperatingBudget', suffix: '$' },
];

const EMPTY_DRAFT = {
  type: '0',
  name: '',
  expected: '',
  remaining: '',
  cost: '',
  comment: '',
};

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modelName, setModelName] = useState('');
  const [selectAssocOpen, setSelectAssocOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [items, setItems] = useState<StudyItem[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [itemTypes, setItemTypes] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [draft, setDraft] = useState({ ...EMPTY_DRAFT });
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAssociations();
  }, []);

  useEffect(() => {
    const assocIdFromUrl = searchParams.get('associationId');
    if (assocIdFromUrl && associations.length > 0) {
      const idx = associations.findIndex((a) => a.id === assocIdFromUrl);
      if (idx !== -1) setSelectedIdx(idx);
    }
  }, [associations, searchParams]);

  useEffect(() => {
    const selectAssocParam = searchParams.get('selectAssociation');
    const assocIdFromUrl = searchParams.get('associationId');
    if (selectAssocParam === '1' && !assocIdFromUrl) {
      setSelectAssocOpen(true);
    }
  }, [searchParams]);

  const fetchAssociations = async () => {
    try {
      const res = await fetch('/api/associations');
      const data = await res.json();
      if (res.status === 401) return;
      if (data.associations && data.associations.length > 0) {
        setAssociations(data.associations);
      }
    } catch (error) {
      console.error('Failed to fetch associations:', error);
    }
  };

  const handleSelectAssociation = (idx: number) => {
    setSelectedIdx(idx);
    const selectedAssociation = associations[idx];
    setSelectAssocOpen(false);
    router.replace(`/study?associationId=${selectedAssociation.id}`, { scroll: false });
  };

  const handleCloseAssociation = () => {
    setSelectAssocOpen(false);
    const assocIdFromUrl = searchParams.get('associationId');
    if (assocIdFromUrl) {
      router.replace(`/study?associationId=${assocIdFromUrl}`, { scroll: false });
    } else {
      router.replace('/study', { scroll: false });
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Template.xlsx';
    link.download = 'Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

        for (let i = 0; i < Math.min(10, jsonData.length); i++) {
          const row = jsonData[i];
          if (row[0]) {
            const label = String(row[0]).trim();
            if (label === 'Enter a unique name for your model') {
              if (row[1]) setModelName(String(row[1]).trim());
              break;
            }
          }
        }

        const newFormData: Record<string, string> = {};
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row[0] && row[1]) {
            const label = String(row[0]).trim();
            const value = String(row[1]).trim();
            if (label.includes('Total Number of Housing Units')) newFormData['housingUnits'] = value;
            else if (label.includes('Beginning Reserve Funds')) newFormData['beginningReserveFunds'] = value;
            else if (label.includes('SIRS Reserve Funds')) newFormData['sirsReserveFunds'] = value;
            else if (label.includes('Inflation Rate')) newFormData['inflationRate'] = value;
            else if (label.includes('Average Monthly Fee')) newFormData['averageMonthlyFee'] = value;
            else if (label.includes('Beginning Fiscal Year')) newFormData['beginningFiscalYear'] = value;
            else if (label.includes('Number of Years Covered')) newFormData['yearsCovered'] = value;
            else if (label.includes('Suggested Rate of Return')) newFormData['rateOfReturn'] = value;
            else if (label.includes('Total Annual Reserve Budget')) newFormData['annualReserveBudget'] = value;
            else if (label.includes('Total Annual Operating Budget')) newFormData['annualOperatingBudget'] = value;
          }
        }
        setFormData(newFormData);

        let headerIndex = -1;
        const columnMapping: Record<string, number> = {};
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          let hasItemName = false;
          let hasExpectedLife = false;
          row.forEach((cell: any, colIndex: number) => {
            const cellStr = String(cell).trim();
            if (cellStr === 'Item Name') {
              columnMapping['name'] = colIndex;
              hasItemName = true;
            } else if (cellStr === 'Expected Life') {
              columnMapping['expected'] = colIndex;
              hasExpectedLife = true;
            } else if (cellStr === 'Remaining Life') {
              columnMapping['remaining'] = colIndex;
            } else if (cellStr === 'Replacement Cost') {
              columnMapping['cost'] = colIndex;
            } else if (cellStr === 'Sirs') {
              columnMapping['type'] = colIndex;
            }
          });
          if (hasItemName && hasExpectedLife) {
            headerIndex = i;
            break;
          }
        }

        if (headerIndex >= 0) {
          const parsedItems: StudyItem[] = [];
          const newItemTypes: Record<number, string> = {};
          for (let i = headerIndex + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.every((cell: any) => !cell || String(cell).trim() === '')) continue;
            const nameValue = row[columnMapping['name']];
            if (nameValue && String(nameValue).trim()) {
              const typeValue = row[columnMapping['type']];
              const itemIndex = parsedItems.length;
              parsedItems.push({
                no: String(itemIndex + 1).padStart(2, '0'),
                name: String(nameValue).trim(),
                expected: Number(row[columnMapping['expected']]) || 0,
                remaining: Number(row[columnMapping['remaining']]) || 0,
                cost: String(row[columnMapping['cost']] || '').trim(),
              });
              if (typeValue !== undefined && typeValue !== null) {
                const typeStr = String(typeValue).trim();
                newItemTypes[itemIndex] =
                  typeStr === '1' || typeStr.toLowerCase() === 'non-sirs' ? '1' : '0';
              } else {
                newItemTypes[itemIndex] = '0';
              }
            }
          }
          setItems(parsedItems);
          setItemTypes(newItemTypes);
          setComments({});
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setToast({ message: 'Error parsing file. Please use the template format.', type: 'error' });
      }
    };
    input.click();
  };

  const commitDraft = () => {
    if (!draft.name.trim()) {
      setToast({ message: 'Enter a name for the new record', type: 'error' });
      return;
    }
    const newIdx = items.length;
    const newItem: StudyItem = {
      no: String(newIdx + 1).padStart(2, '0'),
      name: draft.name.trim(),
      expected: Number(draft.expected) || 0,
      remaining: Number(draft.remaining) || 0,
      cost: draft.cost.trim(),
    };
    setItems([...items, newItem]);
    setItemTypes({ ...itemTypes, [newIdx]: draft.type });
    if (draft.comment.trim()) {
      setComments({ ...comments, [newIdx]: draft.comment.trim() });
    }
    setDraft({ ...EMPTY_DRAFT });
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    const reindexTypes: Record<number, string> = {};
    const reindexComments: Record<number, string> = {};
    Object.keys(itemTypes).forEach((key) => {
      const numKey = Number(key);
      if (numKey === index) return;
      reindexTypes[numKey > index ? numKey - 1 : numKey] = itemTypes[numKey];
    });
    Object.keys(comments).forEach((key) => {
      const numKey = Number(key);
      if (numKey === index) return;
      reindexComments[numKey > index ? numKey - 1 : numKey] = comments[numKey];
    });
    setItemTypes(reindexTypes);
    setComments(reindexComments);
  };

  const handleSaveStudy = async (_status: 'draft' | 'published' = 'draft') => {
    if (!modelName.trim()) {
      setToast({ message: 'Please enter a document name', type: 'error' });
      return;
    }

    const associationId =
      selectedIdx !== undefined && associations[selectedIdx] ? associations[selectedIdx].id : null;

    if (!associationId) {
      setToast({ message: 'Please select an association before saving the study', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const itemsWithSirs = items.map((item, index) => ({
        ...item,
        sirs: itemTypes[index] || '0',
        comment: comments[index] || '',
      }));

      const response = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName,
          formData,
          items: itemsWithSirs,
          associationId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setToast({ message: 'Study saved successfully!', type: 'success' });
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setToast({ message: data.error || 'Failed to save study', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving study:', error);
      setToast({ message: 'Failed to save study', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedAssoc = selectedIdx !== undefined ? associations[selectedIdx] : undefined;

  const visibleItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items.map((item, i) => ({ item, i }));
    return items
      .map((item, i) => ({ item, i }))
      .filter(({ item, i }) => {
        const type = itemTypes[i] === '1' ? 'non-sirs' : 'sirs';
        return (
          item.name.toLowerCase().includes(q) ||
          type.includes(q) ||
          String(item.cost).toLowerCase().includes(q)
        );
      });
  }, [items, itemTypes, searchQuery]);

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* Blue Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0E3E73 0%, #0E519B 100%)',
          height: '230px',
          padding: '28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Row 1: Association dropdown + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1242px',
            width: '100%',
            margin: '0 auto 20px',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectAssocOpen(true)}
            className="flex items-center"
            style={{
              gap: '10px',
              padding: '8px 14px',
              border: 'none',
              background: 'transparent',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '7px',
            }}
          >
            <span style={{ letterSpacing: '-0.01em' }}>
              {selectedAssoc ? selectedAssoc.associationName : 'Select Association'}
            </span>
            <ChevronDown className="w-4 h-4" style={{ color: '#FFFFFF' }} />
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Row 2: Document name + actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            maxWidth: '1242px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Untitled Document Name"
            style={{
              flex: '1 1 260px',
              minWidth: '260px',
              height: '44px',
              borderRadius: '7px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.08)',
              color: '#FFFFFF',
              fontSize: '15px',
              padding: '0 18px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center"
            style={{
              gap: '8px',
              height: '44px',
              padding: '0 18px',
              borderRadius: '7px',
              background: '#FFFFFF',
              color: '#102C4A',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <FileDown className="w-4 h-4" style={{ color: '#102C4A' }} />
            Download Template
          </button>

          <button
            type="button"
            onClick={handleUploadDocument}
            className="flex items-center"
            style={{
              gap: '8px',
              height: '44px',
              padding: '0 18px',
              borderRadius: '7px',
              background: '#FFFFFF',
              color: '#102C4A',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <CloudUpload className="w-4 h-4" style={{ color: '#102C4A' }} />
            Upload Document
          </button>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '7px',
              background: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Download"
          >
            <Download className="w-4 h-4" style={{ color: '#102C4A' }} />
          </button>

          <div style={{ flex: '0 0 8px' }} />

          <button
            type="button"
            onClick={() => handleSaveStudy('draft')}
            disabled={isSaving}
            style={{
              height: '44px',
              padding: '0 24px',
              borderRadius: '7px',
              background: '#3A7FC4',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveStudy('published')}
            disabled={isSaving}
            style={{
              height: '44px',
              padding: '0 28px',
              borderRadius: '7px',
              background: '#0E7BE6',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1242px', margin: '0 auto', padding: '0', marginTop: '-62px' }}>   
        {/* Reserve Study Setting card */}
        <div
          style={{
            border: '1px solid #E6E8EC',
            borderRadius: '7px',
            background: '#FFFFFF',
            boxShadow: '0 1px 2px rgba(16,44,74,0.04)',
             
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '18px 28px',
              borderBottom: '1px solid #EDEFF2',
              background: '#FFFFFF',
            }}
          >
            <h2
              style={{
                color: '#102C4A',
                fontSize: '18px',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Reserve Study Setting
            </h2>
          </div>

          <div style={{ padding: '28px 28px 32px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '64px',
                rowGap: '22px',
              }}
            >
              {LEFT_FIELDS.map((left, idx) => {
                const right = RIGHT_FIELDS[idx];
                return (
                  <Fragment key={idx}>
                    <FieldRow
                      label={left.label}
                      value={formData[left.key] || ''}
                      onChange={(v) => setFormData({ ...formData, [left.key]: v })}
                      suffix={left.suffix}
                    />
                    {right && (
                      <FieldRow
                        label={right.label}
                        value={formData[right.key] || ''}
                        onChange={(v) => setFormData({ ...formData, [right.key]: v })}
                        suffix={right.suffix}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search + Add row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '28px',
            marginBottom: '14px',
            gap: '16px',
          }}
        >
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              className="w-4 h-4"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
              }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Data Records"
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '7px',
                border: '1px solid #D7D7D7',
                background: '#FFFFFF',
                fontSize: '14px',
                color: '#102C4A',
                padding: '0 16px 0 40px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="button"
            onClick={commitDraft}
            className="flex items-center"
            style={{
              gap: '8px',
              height: '44px',
              padding: '0 20px',
              borderRadius: '7px',
              background: '#FFFFFF',
              color: '#102C4A',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #D7D7D7',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus className="w-4 h-4" style={{ color: '#102C4A' }} />
            Add New Record
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            border: '1px solid #E6E8EC',
            borderRadius: '7px',
            overflow: 'hidden',
            background: '#FFFFFF',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '960px' }}>
              <thead>
                <tr style={{ background: '#FFFFFF', borderBottom: '1px solid #EDEFF2' }}>
                  <Th width="56px">No.</Th>
                  <Th width="110px">Type</Th>
                  <Th>Name</Th>
                  <Th width="130px">Expected Life</Th>
                  <Th width="130px">Remaining Life</Th>
                  <Th width="150px">Replacement Cost</Th>
                  <Th>Comment</Th>
                  <Th width="40px">{''}</Th>
                </tr>
              </thead>
              <tbody>
                {/* Draft/input row */}
                <tr style={{ background: '#F5F8FC', borderBottom: '1px solid #EDEFF2' }}>
                  <Td>
                    <span style={{ color: '#66717D', fontSize: '14px' }}>
                      {String(items.length + 1).padStart(2, '0')}
                    </span>
                  </Td>
                  <Td>
                    <Select
                      value={draft.type}
                      onValueChange={(v) => setDraft({ ...draft, type: v })}
                    >
                      <SelectTrigger
                        style={{
                          height: '36px',
                          width: '92px',
                          borderColor: '#D7D7D7',
                          borderRadius: '7px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">SIRS</SelectItem>
                        <SelectItem value="1">Non-SIRS</SelectItem>
                      </SelectContent>
                    </Select>
                  </Td>
                  <Td>
                    <CellInput
                      value={draft.name}
                      onChange={(v) => setDraft({ ...draft, name: v })}
                      placeholder="Untitled Name"
                    />
                  </Td>
                  <Td>
                    <CellInput
                      value={draft.expected}
                      onChange={(v) => setDraft({ ...draft, expected: v })}
                      placeholder="Type here"
                    />
                  </Td>
                  <Td>
                    <CellInput
                      value={draft.remaining}
                      onChange={(v) => setDraft({ ...draft, remaining: v })}
                      placeholder="Type here"
                    />
                  </Td>
                  <Td>
                    <CellInput
                      value={draft.cost}
                      onChange={(v) => setDraft({ ...draft, cost: v })}
                      placeholder="Type here ($)"
                    />
                  </Td>
                  <Td>
                    <CellInput
                      value={draft.comment}
                      onChange={(v) => setDraft({ ...draft, comment: v })}
                      placeholder="Type here"
                    />
                  </Td>
                  <Td>{''}</Td>
                </tr>

                {/* Saved rows */}
                {visibleItems.length === 0 && items.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#9CA3AF',
                        fontSize: '14px',
                      }}
                    >
                      No records found. Fill the row above and click "Add New Record".
                    </td>
                  </tr>
                )}

                {visibleItems.map(({ item, i }, rowIdx) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        rowIdx === visibleItems.length - 1 ? 'none' : '1px solid #EDEFF2',
                      background: '#FFFFFF',
                    }}
                  >
                    <Td>
                      <span style={{ color: '#66717D', fontSize: '14px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Td>
                    <Td>
                      <Select
                        value={itemTypes[i] || '0'}
                        onValueChange={(value) => setItemTypes({ ...itemTypes, [i]: value })}
                      >
                        <SelectTrigger
                          style={{
                            height: '36px',
                            width: '92px',
                            borderColor: '#D7D7D7',
                            borderRadius: '7px',
                            fontSize: '13px',
                            background: '#FFFFFF',
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">SIRS</SelectItem>
                          <SelectItem value="1">Non-SIRS</SelectItem>
                        </SelectContent>
                      </Select>
                    </Td>
                    <Td>
                      <input
                        value={item.name}
                        onChange={(e) => handleUpdateItem(i, 'name', e.target.value)}
                        placeholder="Enter item name"
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#102C4A',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          padding: 0,
                        }}
                      />
                    </Td>
                    <Td>
                      <input
                        type="number"
                        value={item.expected}
                        onChange={(e) => handleUpdateItem(i, 'expected', Number(e.target.value))}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#102C4A',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          padding: 0,
                        }}
                      />
                    </Td>
                    <Td>
                      <input
                        type="number"
                        value={item.remaining}
                        onChange={(e) => handleUpdateItem(i, 'remaining', Number(e.target.value))}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#102C4A',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          padding: 0,
                        }}
                      />
                    </Td>
                    <Td>
                      <input
                        value={item.cost}
                        onChange={(e) => handleUpdateItem(i, 'cost', e.target.value)}
                        placeholder="$0"
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: '#102C4A',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          padding: 0,
                        }}
                      />
                    </Td>
                    <Td>
                      <CellInput
                        value={comments[i] || ''}
                        onChange={(v) => setComments({ ...comments, [i]: v })}
                        placeholder="Type here"
                      />
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9CA3AF',
                          fontSize: '18px',
                          lineHeight: 1,
                          padding: '4px 8px',
                          letterSpacing: '1px',
                        }}
                        aria-label="More"
                      >
                        ...
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AssociationPopup
        open={selectAssocOpen}
        onClose={handleCloseAssociation}
        selectedIdx={selectedIdx}
        onSelect={handleSelectAssociation}
        items={associations.map((a) => ({
          name: a.associationName,
          role: `${a.managerFirstName || ''} ${a.managerLastName || ''}`.trim() || 'Manager',
          logoFileId: a.logoFileId,
        }))}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

function FieldRow({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: '$' | '%';
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}
    >
      <label
        style={{
          color: '#102C4A',
          fontSize: '14px',
          fontWeight: 400,
          flex: 1,
          lineHeight: 1.4,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative', width: '190px', flexShrink: 0 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Value"
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '7px',
            border: '1px solid #D7D7D7',
            background: '#FFFFFF',
            color: '#102C4A',
            fontSize: '14px',
            padding: '0 34px 0 14px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#66717D',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Th({ children, width }: { children: React.ReactNode; width?: string }) {
  return (
    <th
      style={{
        padding: '14px 18px',
        textAlign: 'left',
        color: '#66717D',
        fontSize: '13px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        width,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: '14px 18px',
        verticalAlign: 'middle',
        color: '#102C4A',
        fontSize: '14px',
      }}
    >
      {children}
    </td>
  );
}

function CellInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: '36px',
        borderRadius: '7px',
        border: '1px solid #D7D7D7',
        background: '#FFFFFF',
        color: '#102C4A',
        fontSize: '13px',
        padding: '0 12px',
        outline: 'none',
        fontFamily: 'inherit',
      }}
    />
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '64px 32px' }}>Loading...</div>}>
      <StudyPageContent />
    </Suspense>
  );
}
