import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Read theme source directly — avoids importing React / RN at test time
// ---------------------------------------------------------------------------

function readThemeSource(): string {
  return readFileSync(fileURLToPath(new URL('./ThemeContext.tsx', import.meta.url).href), 'utf8');
}

// Extract a color palette object from raw source text.
// Looks for `const <name>: ThemeColors = { ... }` blocks.
function extractPaletteKeys(source: string, paletteName: string): string[] {
  const paletteMatcher = new RegExp(
    `const ${paletteName}:\\s*ThemeColors\\s*=\\s*\\{([^}]+)\\}`,
    's'
  );
  const match = source.match(paletteMatcher);
  if (!match) {
    return [];
  }
  // Pull out the property keys from the block
  return [...match[1].matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// S16 — Theme palette completeness and consistency
// ---------------------------------------------------------------------------

test('darkColors, lightColors, and lowLightColors all declare the same set of color keys', () => {
  const source = readThemeSource();

  const darkKeys = extractPaletteKeys(source, 'darkColors');
  const lightKeys = extractPaletteKeys(source, 'lightColors');
  const lowLightKeys = extractPaletteKeys(source, 'lowLightColors');

  assert.ok(darkKeys.length > 0, 'darkColors palette should declare color properties');
  assert.ok(lightKeys.length > 0, 'lightColors palette should declare color properties');
  assert.ok(lowLightKeys.length > 0, 'lowLightColors palette should declare color properties');

  assert.deepEqual(
    [...darkKeys].sort(),
    [...lightKeys].sort(),
    'lightColors must define the same keys as darkColors'
  );
  assert.deepEqual(
    [...darkKeys].sort(),
    [...lowLightKeys].sort(),
    'lowLightColors must define the same keys as darkColors'
  );
});

test('ThemeContext exports all three palettes as named constants', () => {
  const source = readThemeSource();

  assert.match(source, /export\s*\{[^}]*darkColors/, 'darkColors must be a named export');
  assert.match(source, /export\s*\{[^}]*lightColors/, 'lightColors must be a named export');
  assert.match(source, /export\s*\{[^}]*lowLightColors/, 'lowLightColors must be a named export');
});

test('ThemeContext supports the low-light theme mode', () => {
  const source = readThemeSource();

  assert.match(source, /'low-light'/, 'ThemeContext should reference low-light as a theme mode');
  assert.match(
    source,
    /lowLightColors/,
    'ThemeContext should reference the lowLightColors palette'
  );
});

test('ThemeContext exposes isDark and isLowLight flags', () => {
  const source = readThemeSource();

  assert.match(source, /isDark/, 'ThemeContextValue should include isDark');
  assert.match(source, /isLowLight/, 'ThemeContextValue should include isLowLight');
});

test('ThemeContext resolves themeMode from stored preference with system fallback', () => {
  const source = readThemeSource();

  // Must read preferences.theme and fall back to systemColorScheme
  assert.match(source, /preferences\.theme/, 'should read theme from stored preferences');
  assert.match(source, /systemColorScheme/, 'should fall back to system color scheme');
});

// ---------------------------------------------------------------------------
// S16 — Supabase client URL validation (pure logic via source inspection)
// ---------------------------------------------------------------------------

test('Supabase client validates URL by requiring https protocol', () => {
  const clientSource = readFileSync(
    fileURLToPath(new URL('../services/supabase/client.ts', import.meta.url).href),
    'utf8'
  );

  assert.match(
    clientSource,
    /url\.protocol === ['"]https:['"]|protocol.*https/,
    "client.ts must enforce the https: protocol when validating the Supabase URL"
  );
});

test('Supabase client falls back gracefully when env vars are absent', () => {
  const clientSource = readFileSync(
    fileURLToPath(new URL('../services/supabase/client.ts', import.meta.url).href),
    'utf8'
  );

  // The file should default to an empty string (not throw) when vars are missing
  assert.match(
    clientSource,
    /\|\|\s*['"]{2}/,
    'client.ts should fall back to an empty string for missing env vars'
  );
});

test('isSupabaseConfigured is exported so callers can guard network calls', () => {
  const clientSource = readFileSync(
    fileURLToPath(new URL('../services/supabase/client.ts', import.meta.url).href),
    'utf8'
  );

  assert.match(
    clientSource,
    /export\s+const\s+isSupabaseConfigured/,
    'client.ts must export isSupabaseConfigured'
  );
});
