import * as XLSX from 'xlsx';

export const REQUIRED_STUDY_LABELS: string[] = [
  'Enter a unique name for your model',
  'Total Number of Housing Units',
  'Beginning Reserve Funds (Dollar Amount)',
  'SIRS Reserve Funds (Dollar Amount)',
  'Inflation Rate Used in the Report',
  'Average Monthly Fee per Unit',
  'Beginning Fiscal Year of the Report',
  'Number of Years Covered in the Report',
  'Suggested Rate of Return on Investments',
];

export const REQUIRED_ITEM_HEADERS: string[] = [
  'Item Name',
  'Expected Life',
  'Remaining Life',
  'Replacement Cost',
  'Sirs',
];

const STUDY_XLSX_EXT = '.xlsx';
const STUDY_XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type StudyTemplateValidation =
  | { ok: true }
  | { ok: false; reason: string };

export function validateStudyFileName(name: string | undefined | null): StudyTemplateValidation {
  if (!name) return { ok: false, reason: 'File name is missing.' };
  if (!name.toLowerCase().endsWith(STUDY_XLSX_EXT)) {
    return { ok: false, reason: 'Only .xlsx files are allowed. Please download the template and upload an .xlsx file.' };
  }
  return { ok: true };
}

export function validateStudyMimeType(mime: string | undefined | null): StudyTemplateValidation {
  if (!mime) return { ok: true }; // some browsers omit the MIME — fall back to the extension check
  const normalized = mime.toLowerCase();
  if (normalized === STUDY_XLSX_MIME) return { ok: true };
  return { ok: false, reason: 'Only .xlsx files are allowed.' };
}

function normalize(cell: unknown): string {
  if (cell === null || cell === undefined) return '';
  return String(cell).trim();
}

function includesLabel(rows: string[][], label: string): boolean {
  const target = label.toLowerCase();
  for (const row of rows) {
    for (const cell of row) {
      if (cell.toLowerCase() === target) return true;
    }
  }
  return false;
}

function findItemsHeaderRow(rows: string[][]): boolean {
  for (const row of rows) {
    const cells = row.map((c) => c.toLowerCase());
    const hasName = cells.includes('item name');
    const hasExpected = cells.includes('expected life');
    const hasRemaining = cells.includes('remaining life');
    const hasCost = cells.includes('replacement cost');
    const hasSirs = cells.includes('sirs');
    if (hasName && hasExpected && hasRemaining && hasCost && hasSirs) return true;
  }
  return false;
}

export function validateStudyTemplateBuffer(buffer: ArrayBuffer | Buffer): StudyTemplateValidation {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: 'array' });
  } catch {
    return { ok: false, reason: 'Could not read the spreadsheet. Make sure the file is a valid .xlsx.' };
  }
  if (!workbook.SheetNames.length) {
    return { ok: false, reason: 'Spreadsheet has no sheets.' };
  }
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' }) as any[][];
  const rows: string[][] = json.map((row) => (Array.isArray(row) ? row.map(normalize) : []));

  const missingLabels = REQUIRED_STUDY_LABELS.filter((label) => !includesLabel(rows, label));
  if (missingLabels.length > 0) {
    return {
      ok: false,
      reason: `Template is missing required rows: ${missingLabels.join(', ')}. Please use the provided Template.xlsx.`,
    };
  }

  if (!findItemsHeaderRow(rows)) {
    return {
      ok: false,
      reason: `Template is missing the items header row (${REQUIRED_ITEM_HEADERS.join(' | ')}). Please use the provided Template.xlsx.`,
    };
  }

  return { ok: true };
}

export async function validateStudyFile(
  file: File
): Promise<StudyTemplateValidation> {
  const nameCheck = validateStudyFileName(file.name);
  if (!nameCheck.ok) return nameCheck;
  const mimeCheck = validateStudyMimeType(file.type);
  if (!mimeCheck.ok) return mimeCheck;
  const buffer = await file.arrayBuffer();
  return validateStudyTemplateBuffer(buffer);
}
