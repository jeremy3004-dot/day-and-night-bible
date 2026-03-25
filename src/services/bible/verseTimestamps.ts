/**
 * verseTimestamps.ts
 *
 * Fetches verse-level audio timestamps for Bible chapters.
 * Timestamps are generated offline via scripts/generate_timestamps.py (aeneas) and
 * served from Supabase Storage at: verse-timestamps/{translationId}/{bookId}/{chapter}.json
 * Format: {"1": 0.0, "2": 4.2, "3": 8.7, ...}  (verse number string → start time in seconds)
 *
 * The fetch result is cached in the device filesystem for offline reuse.
 */

import * as FileSystem from 'expo-file-system/legacy';

// ── Types ────────────────────────────────────────────────────────────────────

/** Map of verse number → start time in seconds. */
export type VerseTimestamps = Record<number, number>;

// ── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? null;

const TIMESTAMP_BUCKET_BASE = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/verse-timestamps`
  : null;

/** Device-local cache directory for timestamp JSON files. */
const CACHE_DIR = `${FileSystem.documentDirectory ?? ''}verse-timestamps/`;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns verse timestamps for a given chapter, or null if unavailable.
 * Checks local cache first; fetches from Supabase on miss.
 *
 * Only WEB and BSB have timestamps generated. Other translations return null
 * and the caller falls back to the word-weight estimation.
 */
export async function getChapterTimestamps(
  translationId: string,
  bookId: string,
  chapter: number
): Promise<VerseTimestamps | null> {
  if (!TIMESTAMP_BUCKET_BASE) return null;

  // Only WEB and BSB have timestamps
  if (translationId !== 'web' && translationId !== 'bsb') return null;

  const objectKey = `${translationId}/${bookId}/${chapter}.json`;
  const cacheFile = `${CACHE_DIR}${objectKey}`;

  // Check local filesystem cache
  try {
    const info = await FileSystem.getInfoAsync(cacheFile);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(cacheFile);
      return parseTimestamps(raw);
    }
  } catch {
    // Cache miss — fall through to network fetch
  }

  // Fetch from Supabase Storage
  try {
    const url = `${TIMESTAMP_BUCKET_BASE}/${objectKey}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const raw = await response.text();
    const timestamps = parseTimestamps(raw);
    if (!timestamps) return null;

    // Persist to local cache
    await FileSystem.makeDirectoryAsync(`${CACHE_DIR}${translationId}/${bookId}/`, {
      intermediates: true,
    });
    await FileSystem.writeAsStringAsync(cacheFile, raw);

    return timestamps;
  } catch {
    return null;
  }
}

/**
 * Lookup which verse is currently playing given a position in seconds.
 * Returns the verse number with the highest start time ≤ currentPosition.
 */
export function lookupVerseAtPosition(
  timestamps: VerseTimestamps,
  currentPosition: number
): number | null {
  const verseNums = (Object.keys(timestamps) as string[]).map(Number).sort((a, b) => a - b);
  if (verseNums.length === 0) return null;

  let current = verseNums[0];
  for (const vn of verseNums) {
    if (timestamps[vn] <= currentPosition) {
      current = vn;
    } else {
      break;
    }
  }
  return current;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseTimestamps(raw: string): VerseTimestamps | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    // Convert string keys to numbers
    const result: VerseTimestamps = {};
    for (const [k, v] of Object.entries(parsed)) {
      const verseNum = parseInt(k, 10);
      if (!Number.isNaN(verseNum) && typeof v === 'number') {
        result[verseNum] = v;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}
