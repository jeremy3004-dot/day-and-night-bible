import test from 'node:test';
import assert from 'node:assert/strict';
import { getBookById } from '../../constants/books';
import {
  createAudioDownloadJobId,
  createAudioDownloadJobStore,
  downloadAudioBook,
  downloadAudioTranslation,
  failAudioDownloadJob,
  reattachAudioDownloadJob,
  startAudioDownloadJob,
  getChapterAudioFileUri,
  getDownloadedChapterAudioUri,
  type AudioFileSystemAdapter,
} from './audioDownloadService';

const createFileSystemDouble = () => {
  const files = new Set<string>();
  const directories = new Set<string>();
  const downloads: Array<{ from: string; to: string }> = [];

  const fileSystem: AudioFileSystemAdapter = {
    ensureDirectory: async (directoryUri) => {
      directories.add(directoryUri);
    },
    fileExists: async (fileUri) => files.has(fileUri),
    downloadFile: async (from, to) => {
      downloads.push({ from, to });
      files.add(to);
    },
  };

  return { fileSystem, files, directories, downloads };
};

const createPersistentFileSystemDouble = () => {
  const files = new Map<string, string>();

  const fileSystem: AudioFileSystemAdapter = {
    ensureDirectory: async () => {},
    fileExists: async (fileUri) => files.has(fileUri),
    downloadFile: async (from, to) => {
      files.set(to, from);
    },
    readTextFile: async (fileUri) => files.get(fileUri) ?? null,
    writeTextFile: async (fileUri, contents) => {
      files.set(fileUri, contents);
    },
    deleteFile: async (fileUri) => {
      files.delete(fileUri);
    },
  };

  return { fileSystem, files };
};

test('createAudioDownloadJobId keeps book and translation download jobs distinct', () => {
  assert.equal(
    createAudioDownloadJobId({ translationId: 'bsb', scope: 'book', bookId: 'GEN' }),
    'audio-download:bsb:book:GEN'
  );
  assert.equal(
    createAudioDownloadJobId({ translationId: 'bsb', scope: 'translation' }),
    'audio-download:bsb:translation:all'
  );
});

test('audio download job store persists records across store instances', async () => {
  const { fileSystem } = createPersistentFileSystemDouble();
  const store = await createAudioDownloadJobStore({
    fileSystem,
    rootUri: 'file:///tmp/everybible-audio/',
  });

  await store.upsertJob({
    id: 'audio-download:bsb:book:GEN',
    translationId: 'bsb',
    scope: 'book',
    bookId: 'GEN',
    status: 'downloading',
    createdAt: 123,
    updatedAt: 456,
    attemptCount: 1,
  });

  const reloadedStore = await createAudioDownloadJobStore({
    fileSystem,
    rootUri: 'file:///tmp/everybible-audio/',
  });
  const jobs = await reloadedStore.listJobs();

  assert.deepEqual(jobs, [
    {
      id: 'audio-download:bsb:book:GEN',
      translationId: 'bsb',
      scope: 'book',
      bookId: 'GEN',
      status: 'downloading',
      createdAt: 123,
      updatedAt: 456,
      attemptCount: 1,
    },
  ]);
});

test('audio download job lifecycle exposes start, reattach, and failure hooks', async () => {
  const { fileSystem } = createPersistentFileSystemDouble();
  const rootUri = 'file:///tmp/everybible-audio-lifecycle/';
  const store = await createAudioDownloadJobStore({
    fileSystem,
    rootUri,
  });

  const events: string[] = [];

  const started = await startAudioDownloadJob({
    translationId: 'bsb',
    scope: 'book',
    bookId: 'GEN',
    jobStore: store,
    hooks: {
      onStart: (job) => events.push(`start:${job.id}:${job.status}`),
    },
  });

  assert.equal(started.status, 'downloading');

  const reattached = await reattachAudioDownloadJob({
    jobId: started.id,
    jobStore: store,
    hooks: {
      onReattach: (job) => events.push(`reattach:${job.id}:${job.status}`),
    },
  });

  assert.ok(reattached);

  const failed = await failAudioDownloadJob({
    jobId: started.id,
    jobStore: store,
    error: new Error('network down'),
    hooks: {
      onFailure: (job, error) => events.push(`failure:${job.id}:${job.status}:${error.message}`),
    },
  });

  assert.equal(failed.status, 'failed');
  assert.deepEqual(events, [
    'start:audio-download:bsb:book:GEN:downloading',
    'reattach:audio-download:bsb:book:GEN:downloading',
    'failure:audio-download:bsb:book:GEN:failed:network down',
  ]);
});

test('getDownloadedChapterAudioUri returns a local file when it has been downloaded', async () => {
  const { fileSystem, files } = createFileSystemDouble();
  const fileUri = getChapterAudioFileUri('bsb', 'JHN', 3);
  files.add(fileUri);

  const localUri = await getDownloadedChapterAudioUri('bsb', 'JHN', 3, fileSystem);

  assert.equal(localUri, fileUri);
});

test('downloadAudioBook downloads each chapter once and creates the book directory', async () => {
  const { fileSystem, directories, downloads } = createFileSystemDouble();
  const philemon = getBookById('PHM');

  assert.ok(philemon);

  const result = await downloadAudioBook({
    translationId: 'bsb',
    book: philemon,
    fileSystem,
    resolveRemoteAudio: async (_translationId, bookId, chapter) => ({
      url: `https://audio.test/${bookId}/${chapter}.mp3`,
      duration: 1000,
    }),
  });

  assert.equal(result.bookId, 'PHM');
  assert.equal(downloads.length, 1);
  assert.equal(directories.size, 1);
  assert.deepEqual(downloads[0], {
    from: 'https://audio.test/PHM/1.mp3',
    to: getChapterAudioFileUri('bsb', 'PHM', 1),
  });
});

test('downloadAudioTranslation returns every fully-downloaded book id in order', async () => {
  const { fileSystem, downloads } = createFileSystemDouble();
  const selectedBooks = ['2JN', '3JN']
    .map((bookId) => getBookById(bookId))
    .filter((book) => book !== undefined);

  const result = await downloadAudioTranslation({
    translationId: 'bsb',
    books: selectedBooks,
    fileSystem,
    resolveRemoteAudio: async (_translationId, bookId, chapter) => ({
      url: `https://audio.test/${bookId}/${chapter}.mp3`,
      duration: 1000,
    }),
  });

  assert.deepEqual(result.downloadedBookIds, ['2JN', '3JN']);
  assert.equal(downloads.length, 2);
});
