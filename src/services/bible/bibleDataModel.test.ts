import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { generateKeyPairSync } from 'node:crypto';
import { CompactSign, importPKCS8 } from 'jose';
import type { BibleTranslation } from '../../types';
import {
  activateTranslationPackCandidate,
  buildInstalledBibleDatabaseSource,
  failTranslationPackCandidate,
  rollbackTranslationPack,
  stageTranslationPackCandidate,
  verifySignedCatalogManifest,
  type SignedCatalogEnvelope,
  type TranslationCatalogManifest,
} from './bibleDataModel';

const { privateKey: TEST_PRIVATE_KEY, publicKey: TEST_PUBLIC_KEY } = generateKeyPairSync('ec', {
  namedCurve: 'P-256',
  privateKeyEncoding: {
    format: 'pem',
    type: 'pkcs8',
  },
  publicKeyEncoding: {
    format: 'pem',
    type: 'spki',
  },
});

async function createSignedEnvelope(
  manifest: TranslationCatalogManifest
): Promise<SignedCatalogEnvelope> {
  const privateKey = await importPKCS8(TEST_PRIVATE_KEY, 'ES256');
  const compactJws = await new CompactSign(Buffer.from(JSON.stringify(manifest)))
    .setProtectedHeader({ alg: 'ES256', kid: 'catalog-key-1' })
    .sign(privateKey);

  return {
    keyId: 'catalog-key-1',
    algorithm: 'ES256',
    compactJws,
  };
}

test('verifySignedCatalogManifest returns the parsed manifest for a valid signed envelope', async () => {
  const manifest: TranslationCatalogManifest = {
    manifestVersion: '2026.03.21',
    issuedAt: '2026-03-21T10:00:00.000Z',
    translations: [
      {
        id: 'niv',
        name: 'New International Version',
        abbreviation: 'NIV',
        language: 'English',
        description: 'Runtime translation from backend catalog',
        copyright: 'Example License',
        hasText: true,
        hasAudio: true,
        audioGranularity: 'chapter',
        totalBooks: 66,
        sizeInMB: 5.2,
        text: {
          format: 'sqlite',
          version: '2026.03.21',
          downloadUrl: 'https://cdn.example.com/niv.sqlite',
          sha256: 'sha256-text',
        },
        audio: {
          strategy: 'stream-template',
          baseUrl: 'https://cdn.example.com/audio/niv',
          chapterPathTemplate: '{bookId}/{chapter}.mp3',
        },
      },
    ],
  };

  const envelope = await createSignedEnvelope(manifest);

  const verifiedManifest = await verifySignedCatalogManifest(envelope, TEST_PUBLIC_KEY);

  assert.deepEqual(verifiedManifest, manifest);
});

test('verifySignedCatalogManifest rejects a tampered signed envelope payload', async () => {
  const manifest: TranslationCatalogManifest = {
    manifestVersion: '2026.03.21',
    issuedAt: '2026-03-21T10:00:00.000Z',
    translations: [],
  };

  const envelope = await createSignedEnvelope(manifest);
  const [header, , signature] = envelope.compactJws.split('.');
  const tamperedPayload = Buffer.from(
    JSON.stringify({ ...manifest, manifestVersion: 'tampered' })
  )
    .toString('base64url');

  await assert.rejects(
    () =>
      verifySignedCatalogManifest(
        {
          ...envelope,
          compactJws: `${header}.${tamperedPayload}.${signature}`,
        },
        TEST_PUBLIC_KEY
      ),
    /signature verification failed|JWS Protected Header is invalid|signature/i
  );
});

function createPackTranslation(
  overrides: Partial<
    BibleTranslation & {
      pendingTextPackLocalPath?: string | null;
      rollbackTextPackVersion?: string | null;
      rollbackTextPackLocalPath?: string | null;
    }
  > = {}
): BibleTranslation & {
  pendingTextPackLocalPath?: string | null;
  rollbackTextPackVersion?: string | null;
  rollbackTextPackLocalPath?: string | null;
} {
  return {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'English',
    description: 'Runtime translation from backend catalog',
    copyright: 'Example License',
    isDownloaded: true,
    downloadedBooks: [],
    downloadedAudioBooks: [],
    totalBooks: 66,
    sizeInMB: 5.2,
    hasText: true,
    hasAudio: true,
    audioGranularity: 'chapter',
    source: 'runtime',
    installState: 'installed',
    activeTextPackVersion: '2026.03.21',
    textPackLocalPath: 'file:///packs/niv-2026-03-21.sqlite',
    ...overrides,
  };
}

test('stageTranslationPackCandidate keeps the active pack while recording a pending candidate', () => {
  const translation = createPackTranslation();

  const staged = stageTranslationPackCandidate(translation, {
    version: '2026.04.01',
    localPath: 'file:///downloads/niv-2026-04-01.sqlite',
  });

  assert.equal(staged.activeTextPackVersion, '2026.03.21');
  assert.equal(staged.textPackLocalPath, 'file:///packs/niv-2026-03-21.sqlite');
  assert.equal(staged.pendingTextPackVersion, '2026.04.01');
  assert.equal(staged.pendingTextPackLocalPath, 'file:///downloads/niv-2026-04-01.sqlite');
  assert.equal(staged.installState, 'installing');
});

test('activateTranslationPackCandidate swaps the active pack and preserves rollback metadata', () => {
  const translation = stageTranslationPackCandidate(createPackTranslation(), {
    version: '2026.04.01',
    localPath: 'file:///downloads/niv-2026-04-01.sqlite',
  });

  const activated = activateTranslationPackCandidate(translation);

  assert.equal(activated.activeTextPackVersion, '2026.04.01');
  assert.equal(activated.textPackLocalPath, 'file:///downloads/niv-2026-04-01.sqlite');
  assert.equal(activated.rollbackTextPackVersion, '2026.03.21');
  assert.equal(activated.rollbackTextPackLocalPath, 'file:///packs/niv-2026-03-21.sqlite');
  assert.equal(activated.pendingTextPackVersion, null);
  assert.equal(activated.pendingTextPackLocalPath, null);
  assert.equal(activated.installState, 'installed');
});

test('failTranslationPackCandidate preserves the last known good pack and exposes rollback availability', () => {
  const translation = stageTranslationPackCandidate(createPackTranslation(), {
    version: '2026.04.01',
    localPath: 'file:///downloads/niv-2026-04-01.sqlite',
  });

  const failed = failTranslationPackCandidate(translation, 'checksum mismatch');

  assert.equal(failed.activeTextPackVersion, '2026.03.21');
  assert.equal(failed.textPackLocalPath, 'file:///packs/niv-2026-03-21.sqlite');
  assert.equal(failed.pendingTextPackVersion, null);
  assert.equal(failed.pendingTextPackLocalPath, null);
  assert.equal(failed.lastInstallError, 'checksum mismatch');
  assert.equal(failed.installState, 'rollback-available');
});

test('rollbackTranslationPack restores the last known good version when rollback metadata exists', () => {
  const translation = createPackTranslation({
    activeTextPackVersion: '2026.04.01',
    textPackLocalPath: 'file:///packs/niv-2026-04-01.sqlite',
    rollbackTextPackVersion: '2026.03.21',
    rollbackTextPackLocalPath: 'file:///packs/niv-2026-03-21.sqlite',
    installState: 'rollback-available',
    lastInstallError: 'checksum mismatch',
  });

  const rolledBack = rollbackTranslationPack(translation);

  assert.equal(rolledBack.activeTextPackVersion, '2026.03.21');
  assert.equal(rolledBack.textPackLocalPath, 'file:///packs/niv-2026-03-21.sqlite');
  assert.equal(rolledBack.rollbackTextPackVersion, null);
  assert.equal(rolledBack.rollbackTextPackLocalPath, null);
  assert.equal(rolledBack.lastInstallError, null);
  assert.equal(rolledBack.installState, 'installed');
});

test('buildInstalledBibleDatabaseSource derives the SQLite directory and database name from a local pack path', () => {
  assert.deepEqual(
    buildInstalledBibleDatabaseSource('niv', 'file:///packs/niv-2026-04-01.sqlite'),
    {
      kind: 'installed',
      translationId: 'niv',
      databaseName: 'niv-2026-04-01.sqlite',
      directory: 'file:///packs',
    }
  );
});
