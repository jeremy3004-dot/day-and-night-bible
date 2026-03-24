-- Phase 28: Multi-Translation Supabase Library — bible_verses table, text_direction column, and anon access policies

-- Add text_direction column to translation_catalog for RTL language support
-- (eBible.org VPL translations include languages like Arabic and Hebrew that are RTL)
ALTER TABLE translation_catalog ADD COLUMN IF NOT EXISTS text_direction TEXT DEFAULT 'ltr';

-- Create bible_verses table mirroring the bundled SQLite verses schema so downloaded
-- data maps 1:1 with the local database format used by bibleDatabase.ts
CREATE TABLE IF NOT EXISTS bible_verses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  translation_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  heading TEXT,
  UNIQUE (translation_id, book_id, chapter, verse)
);

-- Indexes for efficient chapter lookups and translation-level filtering
CREATE INDEX idx_bible_verses_translation ON bible_verses(translation_id);
CREATE INDEX idx_bible_verses_chapter_lookup ON bible_verses(translation_id, book_id, chapter);

-- Enable RLS on bible_verses
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Public-read policies for bible_verses: both anon and authenticated roles can SELECT
-- (unauthenticated users can browse and download translations)
CREATE POLICY "bible_verses_select_anon"
  ON bible_verses FOR SELECT TO anon USING (true);

CREATE POLICY "bible_verses_select_authenticated"
  ON bible_verses FOR SELECT TO authenticated USING (true);

-- Fix translation_catalog RLS to also allow anon reads
-- (Phase 21 only granted the authenticated role; unauthenticated users also need catalog access)
CREATE POLICY "catalog_select_anon"
  ON translation_catalog FOR SELECT TO anon USING (true);

-- Fix translation_versions RLS to also allow anon reads
-- (Phase 21 only granted the authenticated role; must be consistent with catalog)
CREATE POLICY "versions_select_anon"
  ON translation_versions FOR SELECT TO anon USING (true);

-- No INSERT/UPDATE/DELETE policies for anon or authenticated on bible_verses.
-- The import script uses the service_role key which bypasses RLS entirely.
