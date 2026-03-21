import { Audio } from 'expo-av';
import type { BackgroundMusicChoice } from '../../types';
import { configureAudioMode } from './audioPlayer';
import { getBackgroundMusicOption, getBackgroundMusicSource } from './backgroundMusicCatalog';

class BackgroundMusicPlayer {
  private sound: Audio.Sound | null = null;
  private currentChoice: Exclude<BackgroundMusicChoice, 'off'> | null = null;
  private isConfigured = false;
  private loadRequestId = 0;

  async configure(): Promise<void> {
    if (this.isConfigured) {
      return;
    }

    await configureAudioMode();
    this.isConfigured = true;
  }

  private async unloadCurrentSound(): Promise<void> {
    if (!this.sound) {
      return;
    }

    const sound = this.sound;
    this.sound = null;

    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch {
      // Ignore unload races for rapid preset switches.
    }
  }

  private async ensureLoaded(choice: Exclude<BackgroundMusicChoice, 'off'>): Promise<void> {
    if (this.currentChoice === choice && this.sound) {
      return;
    }

    await this.configure();

    const source = getBackgroundMusicSource(choice);
    const option = getBackgroundMusicOption(choice);
    if (!source || !option) {
      return;
    }

    const requestId = ++this.loadRequestId;

    await this.unloadCurrentSound();

    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: false,
      isLooping: true,
      volume: option.defaultVolume,
      progressUpdateIntervalMillis: 1000,
    });

    if (requestId !== this.loadRequestId) {
      await sound.unloadAsync();
      return;
    }

    this.sound = sound;
    this.currentChoice = choice;
  }

  async sync(choice: BackgroundMusicChoice, shouldPlay: boolean): Promise<void> {
    if (choice === 'off') {
      this.currentChoice = null;
      this.loadRequestId += 1;
      await this.unloadCurrentSound();
      return;
    }

    await this.ensureLoaded(choice);

    if (!this.sound) {
      return;
    }

    if (shouldPlay) {
      try {
        await this.sound.playAsync();
      } catch {
        // Ignore play races; the next sync pass will reconcile.
      }
      return;
    }

    try {
      await this.sound.pauseAsync();
    } catch {
      // Ignore pause races; the next sync pass will reconcile.
    }
  }

  async stop(): Promise<void> {
    this.currentChoice = null;
    this.loadRequestId += 1;
    await this.unloadCurrentSound();
  }
}

export const backgroundMusicPlayer = new BackgroundMusicPlayer();
