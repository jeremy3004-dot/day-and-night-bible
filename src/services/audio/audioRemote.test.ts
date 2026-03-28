import test from 'node:test';
import assert from 'node:assert/strict';
import { getTranslationById } from '../../constants/translations';
import {
  clearSelectedAudioVoiceSelection,
  syncSelectedAudioVoiceSelection,
} from './audioVoiceSelection';
import {
  clearRemoteAudioCache,
  fetchRemoteChapterAudio,
  getRemoteAudioFileExtension,
  isRemoteAudioAvailable,
  setRemoteAudioMetadataResolver,
} from './audioRemote';

test.afterEach(() => {
  clearRemoteAudioCache();
  setRemoteAudioMetadataResolver(null);
  clearSelectedAudioVoiceSelection();
});

test('berean standard bible audio resolves the default souer chapter URL', async () => {
  const audio = await fetchRemoteChapterAudio('bsb', 'GEN', 1);

  assert.deepEqual(audio, {
    url: 'https://openbible.com/audio/souer/BSB_01_Gen_001.mp3',
    duration: 0,
  });
});

test('berean standard bible audio resolves the selected gilbert voice chapter URL', async () => {
  syncSelectedAudioVoiceSelection({
    bsb: 'gilbert',
  });

  const audio = await fetchRemoteChapterAudio('bsb', 'GEN', 1);

  assert.deepEqual(audio, {
    url: 'https://openbible.com/audio/gilbert/BSB_01_Gen_001_G.mp3',
    duration: 0,
  });
});

test('bsb voice catalog exposes supported voices with country flag metadata', () => {
  const bsb = getTranslationById('bsb');
  const voices = bsb?.catalog?.audio?.voiceCatalog?.voices ?? [];

  assert.equal(bsb?.catalog?.audio?.voiceCatalog?.defaultVoiceId, 'souer');
  assert.deepEqual(
    voices.map((voice) => ({
      id: voice.id,
      label: voice.label,
      countryCode: voice.flag.countryCode,
      flagEmoji: voice.flag.emoji,
    })),
    [
      {
        id: 'gilbert',
        label: 'Jordan Scott Gilbert',
        countryCode: 'US',
        flagEmoji: '🇺🇸',
      },
      {
        id: 'hays',
        label: 'Barry Hays',
        countryCode: 'US',
        flagEmoji: '🇺🇸',
      },
      {
        id: 'souer',
        label: 'Bob Souer',
        countryCode: 'US',
        flagEmoji: '🇺🇸',
      },
    ]
  );
});

test('world english bible audio resolves a direct public-domain chapter file without Bible.is credentials', async () => {
  const audio = await fetchRemoteChapterAudio('web', 'GEN', 1);

  assert.deepEqual(audio, {
    url: 'https://ebible.org/eng-webbe/mp3/eng-webbe_002_GEN_01.mp3',
    duration: 0,
  });
});

test('world english bible audio supports psalms three-digit chapter filenames', async () => {
  const audio = await fetchRemoteChapterAudio('web', 'PSA', 150);

  assert.deepEqual(audio, {
    url: 'https://ebible.org/eng-webbe/mp3/eng-webbe_020_PSA_150.mp3',
    duration: 0,
  });
});

test('world english bible audio returns null for unsupported books', async () => {
  const audio = await fetchRemoteChapterAudio('web', 'XXX', 1);

  assert.equal(audio, null);
});

test('world english bible audio returns null for invalid chapters', async () => {
  const audio = await fetchRemoteChapterAudio('web', 'GEN', 0);

  assert.equal(audio, null);
});

test('public-domain web audio remains remotely available without Bible.is credentials', () => {
  assert.equal(isRemoteAudioAvailable('web'), true);
});

test('bsb audio remains remotely available through the openbible voice catalog', () => {
  assert.equal(isRemoteAudioAvailable('bsb'), true);
});

test('translations without configured audio remain unavailable remotely', () => {
  assert.equal(isRemoteAudioAvailable('kjv'), false);
});

test('runtime stream-template audio resolves through the injected metadata resolver', async () => {
  setRemoteAudioMetadataResolver((translationId) => {
    if (translationId !== 'niv') {
      return null;
    }

    return {
      id: 'niv',
      hasAudio: true,
      audio: {
        strategy: 'stream-template',
        baseUrl: 'https://cdn.example.com/audio/niv',
        chapterPathTemplate: '{bookId}/{chapter}.mp3',
      },
    };
  });

  const audio = await fetchRemoteChapterAudio('niv', 'JHN', 3);

  assert.deepEqual(audio, {
    url: 'https://cdn.example.com/audio/niv/JHN/3.mp3',
    duration: 0,
  });
  assert.equal(isRemoteAudioAvailable('niv'), true);
});

test('runtime stream-template audio exposes its configured file extension for local downloads', () => {
  setRemoteAudioMetadataResolver((translationId) => {
    if (translationId !== 'niv') {
      return null;
    }

    return {
      id: 'niv',
      hasAudio: true,
      fileExtension: 'm4a',
      audio: {
        strategy: 'stream-template',
        baseUrl: 'https://cdn.example.com/audio/niv',
        chapterPathTemplate: '{bookId}/{chapter}.m4a',
      },
    };
  });

  assert.equal(getRemoteAudioFileExtension('niv'), 'm4a');
});

test('runtime provider audio resolves through the injected metadata resolver', async () => {
  setRemoteAudioMetadataResolver((translationId) => {
    if (translationId !== 'esv') {
      return null;
    }

    return {
      id: 'esv',
      hasAudio: true,
      audio: {
        strategy: 'provider',
        provider: 'ebible-webbe',
      },
    };
  });

  const audio = await fetchRemoteChapterAudio('esv', 'ROM', 8);

  assert.deepEqual(audio, {
    url: 'https://ebible.org/eng-webbe/mp3/eng-webbe_075_ROM_08.mp3',
    duration: 0,
  });
  assert.equal(isRemoteAudioAvailable('esv'), true);
});
