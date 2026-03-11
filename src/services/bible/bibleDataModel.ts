export const BUNDLED_BIBLE_SCHEMA_VERSION = 2;

export type BundledBibleDatabaseStatus = {
  verseCount: number;
  schemaVersion: number;
  hasSearchIndex: boolean;
};

export function isBundledBibleDatabaseReady(
  status: BundledBibleDatabaseStatus,
  minimumReadyVerseCount: number
): boolean {
  return (
    status.verseCount >= minimumReadyVerseCount &&
    status.schemaVersion >= BUNDLED_BIBLE_SCHEMA_VERSION &&
    status.hasSearchIndex
  );
}

export function buildBibleSearchQuery(query: string): string | null {
  const tokens = query.match(/[\p{L}\p{N}]+/gu)?.map((token) => token.trim()) ?? [];
  const normalizedTokens = tokens.filter((token) => token.length > 0);

  if (normalizedTokens.length === 0) {
    return null;
  }

  return normalizedTokens.map((token) => `${token}*`).join(' ');
}
