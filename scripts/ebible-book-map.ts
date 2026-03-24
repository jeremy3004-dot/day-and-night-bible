/**
 * Mapping from eBible.org 3-letter OSIS book codes (used in VPL XML `b` attribute)
 * to the app's internal book_id values used in the SQLite and Supabase bible_verses table.
 *
 * Both use the same 3-letter uppercase OSIS abbreviations, so this map is effectively
 * an identity map for the 66 canonical books. Its purpose is to:
 *   1. Act as an explicit allowlist (deuterocanonical/apocryphal books will not have an entry)
 *   2. Provide a canonical order for CANONICAL_BOOK_IDS
 *   3. Allow future remapping if eBible encoding ever differs from app encoding
 */
export const EBIBLE_BOOK_MAP: Record<string, string> = {
  // Old Testament (39 books)
  GEN: 'GEN',
  EXO: 'EXO',
  LEV: 'LEV',
  NUM: 'NUM',
  DEU: 'DEU',
  JOS: 'JOS',
  JDG: 'JDG',
  RUT: 'RUT',
  '1SA': '1SA',
  '2SA': '2SA',
  '1KI': '1KI',
  '2KI': '2KI',
  '1CH': '1CH',
  '2CH': '2CH',
  EZR: 'EZR',
  NEH: 'NEH',
  EST: 'EST',
  JOB: 'JOB',
  PSA: 'PSA',
  PRO: 'PRO',
  ECC: 'ECC',
  SNG: 'SNG',
  ISA: 'ISA',
  JER: 'JER',
  LAM: 'LAM',
  EZK: 'EZK',
  DAN: 'DAN',
  HOS: 'HOS',
  JOL: 'JOL',
  AMO: 'AMO',
  OBA: 'OBA',
  JON: 'JON',
  MIC: 'MIC',
  NAM: 'NAM',
  HAB: 'HAB',
  ZEP: 'ZEP',
  HAG: 'HAG',
  ZEC: 'ZEC',
  MAL: 'MAL',
  // New Testament (27 books)
  MAT: 'MAT',
  MRK: 'MRK',
  LUK: 'LUK',
  JHN: 'JHN',
  ACT: 'ACT',
  ROM: 'ROM',
  '1CO': '1CO',
  '2CO': '2CO',
  GAL: 'GAL',
  EPH: 'EPH',
  PHP: 'PHP',
  COL: 'COL',
  '1TH': '1TH',
  '2TH': '2TH',
  '1TI': '1TI',
  '2TI': '2TI',
  TIT: 'TIT',
  PHM: 'PHM',
  HEB: 'HEB',
  JAS: 'JAS',
  '1PE': '1PE',
  '2PE': '2PE',
  '1JN': '1JN',
  '2JN': '2JN',
  '3JN': '3JN',
  JUD: 'JUD',
  REV: 'REV',
};

/**
 * All 66 canonical book IDs in canonical order.
 * Used for validation — any book ID encountered during import that is not in this list
 * is deuterocanonical or apocryphal and should be skipped.
 */
export const CANONICAL_BOOK_IDS: string[] = Object.values(EBIBLE_BOOK_MAP);
