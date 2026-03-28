import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { selahShell } from './selahShell';
import { mergeTranslationTrees } from '../mergeTranslationTree';

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

const flattenKeys = (tree: TranslationTree, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [nextKey] : flattenKeys(value, nextKey);
  });

test('every supported interface language has a locale file', async () => {
  await Promise.all(
    SUPPORTED_LANGUAGES.map(async (language) => {
      const localeFile = path.join(process.cwd(), 'src/i18n/locales', `${language.code}.ts`);
      await access(localeFile);
    })
  );
});

test('every supported locale preserves the full translation keyset', async () => {
  const selahShellKeys = flattenKeys(selahShell as TranslationTree).sort();

  for (const language of SUPPORTED_LANGUAGES) {
    if (language.code === 'en') {
      continue;
    }

    const localeFile = path.join(process.cwd(), 'src/i18n/locales', `${language.code}.ts`);
    const localeModule = await import(pathToFileURL(localeFile).href);
    const localeTree = localeModule[language.code] as TranslationTree | undefined;

    assert.ok(localeTree, `Expected locale export for ${language.code}`);
    const mergedKeys = flattenKeys(mergeTranslationTrees(localeTree, selahShell)).sort();

    selahShellKeys.forEach((key) => {
      assert.ok(mergedKeys.includes(key), `Expected ${language.code} to include ${key}`);
    });
  }
});
