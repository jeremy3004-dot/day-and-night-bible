export interface TranslationTree {
  [key: string]: string | TranslationTree;
}

function isTranslationTree(value: unknown): value is TranslationTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergeTranslationTrees<T extends TranslationTree>(
  base: T,
  overlay: TranslationTree
): T {
  const merged: TranslationTree = { ...base };

  Object.entries(overlay).forEach(([key, value]) => {
    const baseValue = merged[key];

    if (isTranslationTree(baseValue) && isTranslationTree(value)) {
      merged[key] = mergeTranslationTrees(baseValue, value);
      return;
    }

    merged[key] = value;
  });

  return merged as T;
}
