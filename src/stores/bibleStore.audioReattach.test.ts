import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('audio download reattach startup hook is wired in App boot flow', async () => {
  const appPath = path.resolve(process.cwd(), 'App.tsx');
  const appSource = await readFile(appPath, 'utf8');

  assert.match(appSource, /useBibleStore\(\(state\) => state\.reattachAudioDownloads\)/);
  assert.match(appSource, /void reattachAudioDownloads\(\)\.catch\(/);
});
