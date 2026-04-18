'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, CloudUpload, FileDown, History, FileSpreadsheet } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';
import { AssociationPopup, AssociationItem } from '@/components/association-popup';
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

const SUMMARY_ROWS: {
  leftLabel: string;
  rightLabel: string;
}[] = [
  {
    leftLabel: 'Total Number of Housing Units',
    rightLabel: 'Beginning Fiscal Year of the Report',
  },
  {
    leftLabel: 'Beginning Reserve Funds (Dollar Amount)',
    rightLabel: 'Number of Years Covered in the Report',
  },
  {
    leftLabel: 'SIRS Reserve Funds (Dollar Amount)',
    rightLabel: 'Suggested Rate of Return on Investments',
  },
  {
    leftLabel: 'Inflation Rate Used in the Report',
    rightLabel: 'Average Monthly Fee per Unit',
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

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modelName, setModelName] = useState('');
  const [selectAssocOpen, setSelectAssocOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [items, setItems] = useState<typeof ITEMS>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [itemTypes, setItemTypes] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAssociations();
  }, []);

  useEffect(() => {
    // Check if there's an associationId in the URL
    const assocIdFromUrl = searchParams.get('associationId');
    console.log('URL associationId:', assocIdFromUrl);
    console.log('Associations loaded:', associations.length);
    
    if (assocIdFromUrl && associations.length > 0) {
      const idx = associations.findIndex(a => a.id === assocIdFromUrl);
      console.log('Found association at index:', idx);
      if (idx !== -1) {
        setSelectedIdx(idx);
        console.log('Set selectedIdx to:', idx, 'Association:', associations[idx]);
      }
    }
  }, [associations, searchParams]);

  const fetchAssociations = async () => {
    try {
      const res = await fetch('/api/associations');
      const data = await res.json();
      
      if (res.status === 401) {
        console.error('Not authenticated');
        return;
      }
      
      if (data.associations && data.associations.length > 0) {
        setAssociations(data.associations);
      }
    } catch (error) {
      console.error('Failed to fetch associations:', error);
    }
  };

  useEffect(() => {
    const selectAssocParam = searchParams.get('selectAssociation');
    const assocIdFromUrl = searchParams.get('associationId');
    
    console.log('URL params:', { selectAssocParam, assocIdFromUrl });
    
    // Open popup if selectAssociation=1 and no association is selected yet
    if (selectAssocParam === '1' && !assocIdFromUrl) {
      setSelectAssocOpen(true);
    }
  }, [searchParams]);

  const handleSelectAssociation = (idx: number) => {
    setSelectedIdx(idx);
    const selectedAssociation = associations[idx];
    console.log('Selected association:', selectedAssociation, 'at index:', idx);
    setSelectAssocOpen(false);
    // Add associationId to URL and remove selectAssociation param
    router.replace(`/study?associationId=${selectedAssociation.id}`, { scroll: false });
  };

  const handleCloseAssociation = () => {
    setSelectAssocOpen(false);
    // Keep associationId in URL if it exists
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
      if (file) {
        try {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

          // Parse model name from the Excel file
          for (let i = 0; i < Math.min(10, jsonData.length); i++) {
            const row = jsonData[i];
            if (row[0]) {
              const label = String(row[0]).trim();
              if (label === 'Enter a unique name for your model') {
                if (row[1]) {
                  setModelName(String(row[1]).trim());
                }
                break;
              }
            }
          }

          // Parse form fields from the first section
          const newFormData: Record<string, string> = {};
          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row[0] && row[1]) {
              const label = String(row[0]).trim();
              const value = String(row[1]).trim();
              
              // Map the labels to form fields
              if (label.includes('Total Number of Housing Units')) {
                newFormData['housingUnits'] = value;
              } else if (label.includes('Beginning Reserve Funds')) {
                newFormData['beginningReserveFunds'] = value;
              } else if (label.includes('SIRS Reserve Funds')) {
                newFormData['sirsReserveFunds'] = value;
              } else if (label.includes('Inflation Rate')) {
                newFormData['inflationRate'] = value;
              } else if (label.includes('Average Monthly Fee')) {
                newFormData['averageMonthlyFee'] = value;
              } else if (label.includes('Beginning Fiscal Year')) {
                newFormData['beginningFiscalYear'] = value;
              } else if (label.includes('Number of Years Covered')) {
                newFormData['yearsCovered'] = value;
              } else if (label.includes('Suggested Rate of Return')) {
                newFormData['rateOfReturn'] = value;
              } else if (label.includes('Total Annual Reserve Budget')) {
                newFormData['annualReserveBudget'] = value;
              } else if (label.includes('Total Annual Operating Budget')) {
                newFormData['annualOperatingBudget'] = value;
              }
            }
          }
          setFormData(newFormData);

          // Find the items table header row - looking for exact headers
          let headerIndex = -1;
          let columnMapping: Record<string, number> = {};
          
          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            
            // Look for header row with "Item Name", "Expected Life", etc.
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
            
            // If we found the key headers, this is our header row
            if (hasItemName && hasExpectedLife) {
              headerIndex = i;
              break;
            }
          }

          // Parse items table
          if (headerIndex >= 0) {
            const parsedItems: Array<{ no: string; name: string; expected: number; remaining: number; cost: string }> = [];
            const newItemTypes: Record<number, string> = {};
            for (let i = headerIndex + 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              
              // Skip empty rows
              if (!row || row.every((cell: any) => !cell || String(cell).trim() === '')) {
                continue;
              }
              
              const nameValue = row[columnMapping['name']];
              
              // Only add if we have a name
              if (nameValue && String(nameValue).trim()) {
                const typeValue = row[columnMapping['type']];
                const itemIndex = parsedItems.length;
                
                const item = {
                  no: String(itemIndex + 1).padStart(2, '0'),
                  name: String(nameValue).trim(),
                  expected: Number(row[columnMapping['expected']]) || 0,
                  remaining: Number(row[columnMapping['remaining']]) || 0,
                  cost: String(row[columnMapping['cost']] || '').trim(),
                };
                parsedItems.push(item);
                
                // Set type: 0 for SIRS, 1 for Non-SIRS
                if (typeValue !== undefined && typeValue !== null) {
                  const typeStr = String(typeValue).trim();
                  newItemTypes[itemIndex] = typeStr === '1' || typeStr.toLowerCase() === 'non-sirs' ? '1' : '0';
                } else {
                  newItemTypes[itemIndex] = '0';
                }
              }
            }
            setItems(parsedItems);
            setItemTypes(newItemTypes);
            console.log('Parsed items:', parsedItems);
            console.log('Item types:', newItemTypes);
          }

          console.log('File parsed successfully:', file.name);
          console.log('Form data:', newFormData);
        } catch (error) {
          console.error('Error parsing file:', error);
          alert('Error parsing file. Please make sure it matches the template format.');
        }
      }
    };
    input.click();
  };

  const handleAddNewRecord = () => {
    const newItem = {
      no: String(items.length + 1).padStart(2, '0'),
      name: '',
      expected: 0,
      remaining: 0,
      cost: '',
    };
    setItems([...items, newItem]);
    setItemTypes({ ...itemTypes, [items.length]: '0' });
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    const newItemTypes = { ...itemTypes };
    delete newItemTypes[index];
    // Reindex the remaining items
    const reindexed: Record<number, string> = {};
    Object.keys(newItemTypes).forEach((key) => {
      const numKey = Number(key);
      if (numKey > index) {
        reindexed[numKey - 1] = newItemTypes[numKey];
      } else {
        reindexed[numKey] = newItemTypes[numKey];
      }
    });
    setItemTypes(reindexed);
  };

  const handleSaveStudy = async () => {
    if (!modelName.trim()) {
      setToast({ message: 'Please enter a model name', type: 'error' });
      return;
    }

    const associationId = selectedIdx !== undefined && associations[selectedIdx]
      ? associations[selectedIdx].id
      : null;

    if (!associationId) {
      setToast({ message: 'Please select an association before saving the study', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      // Merge items with their SIRS values
      const itemsWithSirs = items.map((item, index) => ({
        ...item,
        sirs: itemTypes[index] || '0',
      }));

      console.log('Saving study with:', {
        modelName,
        selectedIdx,
        associationId,
        associationsLength: associations.length,
        selectedAssociation: selectedIdx !== undefined ? associations[selectedIdx] : null,
      });

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
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
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

  const getFieldKey = (label: string): string => {
    if (label.includes('Total Number of Housing Units')) return 'housingUnits';
    if (label.includes('Beginning Reserve Funds')) return 'beginningReserveFunds';
    if (label.includes('SIRS Reserve Funds')) return 'sirsReserveFunds';
    if (label.includes('Inflation Rate')) return 'inflationRate';
    if (label.includes('Average Monthly Fee')) return 'averageMonthlyFee';
    if (label.includes('Beginning Fiscal Year')) return 'beginningFiscalYear';
    if (label.includes('Number of Years Covered')) return 'yearsCovered';
    if (label.includes('Suggested Rate of Return')) return 'rateOfReturn';
    return label;
  };

  return (
    <div className="min-h-screen" style={{ background: '#F6F7F9' }}>
      {/* Blue Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1E5A96 0%, #2B6FB0 100%)',
          padding: '18px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1
          style={{
            color: '#FFFFFF',
            fontSize: '22px',
            fontWeight: 600,
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Add Reserve Study Data
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '9px 28px',
              borderRadius: '8px',
              background: '#FFFFFF',
              color: '#102C4A',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveStudy}
            disabled={isSaving}
            style={{
              padding: '9px 28px',
              borderRadius: '8px',
              background: isSaving ? '#9CA3AF' : '#0E5AAB',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Study'}
          </button>
        </div>
      </div>

      {/* Page body */}
      <div
        className="mx-auto"
        style={{
          maxWidth: '1240px',
          padding: '40px 60px 80px',
        }}
      >
        {/* Study Name Input */}
        <Input
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Enter a unique name for your model"
          style={{
            width: '100%',
            height: '60px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            fontSize: '16px',
            color: '#B8BCC4',
            marginBottom: '32px',
            padding: '0 28px',
            fontWeight: 400,
          }}
        />

        {/* Selected Association Display */}
        {selectedIdx !== undefined && associations[selectedIdx] && (
          <div
            style={{
              padding: '16px 28px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              background: '#F0F9FF',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#0E5AAB', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                Selected Association
              </div>
              <div style={{ color: '#102C4A', fontSize: '16px', fontWeight: 500 }}>
                {associations[selectedIdx].associationName}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectAssocOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #0E5AAB',
                background: '#FFFFFF',
                color: '#0E5AAB',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Change
            </button>
          </div>
        )}

        {/* Document Setup Section */}
        <div
          className="bg-white"
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <h2
                style={{
                  color: '#102C4A',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                Document Setup
              </h2>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '13px',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                Configure your reserve study settings to accurately plan, track, and forecast long-term maintenance funds.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, marginLeft: '32px' }}>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center"
                style={{
                  gap: '8px',
                  padding: '10px 20px',
                  border: '1.5px solid #0E5AAB',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#0E5AAB',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <FileDown className="w-4 h-4" />
                Download Template
              </button>
              <button
                type="button"
                onClick={handleUploadDocument}
                className="flex items-center"
                style={{
                  gap: '8px',
                  padding: '10px 20px',
                  border: '1.5px solid #0E5AAB',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#0E5AAB',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <CloudUpload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div style={{ display: 'grid', gap: '24px' }}>
            {SUMMARY_ROWS.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: row.rightLabel ? '1fr 1fr' : '1fr',
                  gap: '32px',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label
                    style={{
                      color: '#102C4A',
                      fontSize: '14px',
                      fontWeight: 400,
                      minWidth: '280px',
                      flex: '0 0 auto',
                    }}
                  >
                    {row.leftLabel}
                  </label>
                  <Input
                    placeholder="Type here"
                    value={formData[getFieldKey(row.leftLabel)] || ''}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey(row.leftLabel)]: e.target.value })}
                    style={{
                      height: '44px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      flex: 1,
                    }}
                  />
                </div>
                {row.rightLabel && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label
                      style={{
                        color: '#102C4A',
                        fontSize: '14px',
                        fontWeight: 400,
                        minWidth: '280px',
                        flex: '0 0 auto',
                      }}
                    >
                      {row.rightLabel}
                    </label>
                    <Input
                      placeholder="Type here"
                      value={formData[getFieldKey(row.rightLabel)] || ''}
                      onChange={(e) => setFormData({ ...formData, [getFieldKey(row.rightLabel)]: e.target.value })}
                      style={{
                        height: '44px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '14px',
                        color: '#9CA3AF',
                        flex: 1,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items Section */}
        <div
          className="bg-white"
          style={{
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '28px',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <h2
                style={{
                  color: '#102C4A',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                {items.length} items found.
              </h2>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '13px',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                Configure your reserve study settings to accurately plan, track, and forecast long-term maintenance funds.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, marginLeft: '32px' }}>
              <button
                type="button"
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <FileSpreadsheet className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <History className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>
          </div>

          {/* Items table */}
          {items.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Item Name</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Expected Life</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Remaining Life</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Replacement Cost</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#102C4A', fontSize: '14px', fontWeight: 600 }}>Sirs</th>
                    <th style={{ padding: '14px 20px', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i === items.length - 1 ? 'none' : '1px solid #F3F4F6',
                        background: '#FFFFFF',
                      }}
                    >
                      <td style={{ padding: '18px 20px', maxWidth: '400px' }}>
                        <Input
                          value={item.name}
                          onChange={(e) => handleUpdateItem(i, 'name', e.target.value)}
                          placeholder="Enter item name"
                          style={{
                            height: '38px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '7px',
                            fontSize: '13px',
                            color: '#102C4A',
                            background: '#FAFAFA',
                          }}
                        />
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        <Input
                          type="number"
                          value={item.expected}
                          onChange={(e) => handleUpdateItem(i, 'expected', Number(e.target.value))}
                          style={{
                            height: '38px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '7px',
                            fontSize: '13px',
                            color: '#102C4A',
                            background: '#FAFAFA',
                            textAlign: 'center',
                            width: '100px',
                          }}
                        />
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        <Input
                          type="number"
                          value={item.remaining}
                          onChange={(e) => handleUpdateItem(i, 'remaining', Number(e.target.value))}
                          style={{
                            height: '38px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '7px',
                            fontSize: '13px',
                            color: '#102C4A',
                            background: '#FAFAFA',
                            textAlign: 'center',
                            width: '100px',
                          }}
                        />
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        <Input
                          value={item.cost}
                          onChange={(e) => handleUpdateItem(i, 'cost', e.target.value)}
                          placeholder="$0"
                          style={{
                            height: '38px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '7px',
                            fontSize: '13px',
                            color: '#102C4A',
                            background: '#FAFAFA',
                            width: '140px',
                          }}
                        />
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        <Select 
                          value={itemTypes[i] || '0'}
                          onValueChange={(value) => setItemTypes({ ...itemTypes, [i]: value })}
                        >
                          <SelectTrigger
                            style={{
                              height: '38px',
                              width: '110px',
                              borderColor: '#E5E7EB',
                              borderRadius: '7px',
                              fontSize: '13px',
                              background: '#FAFAFA',
                            }}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">SIRS</SelectItem>
                            <SelectItem value="1">Non-SIRS</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(i)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#D1D5DB',
                            fontSize: '20px',
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#9CA3AF',
                fontSize: '14px',
              }}
            >
              No records found. Click "+ Add New Record" to add items.
            </div>
          )}

          {/* Add New Record Button */}
          <button
            type="button"
            onClick={handleAddNewRecord}
            style={{
              marginTop: '24px',
              color: '#0E5AAB',
              fontSize: '14px',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            + Add New Record
          </button>
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '64px 32px' }}>Loading...</div>}>
      <StudyPageContent />
    </Suspense>
  );
}
