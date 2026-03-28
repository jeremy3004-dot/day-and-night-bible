import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';
import type { RootTabName } from './types';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface RootTabManifestEntry {
  name: RootTabName;
  labelKey: string;
  focusedIcon: IconName;
  unfocusedIcon: IconName;
}

export const rootTabManifest: RootTabManifestEntry[] = [
  {
    name: 'Home',
    labelKey: 'tabs.home',
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
  },
  {
    name: 'Bible',
    labelKey: 'tabs.bible',
    focusedIcon: 'book',
    unfocusedIcon: 'book-outline',
  },
  {
    name: 'Meditate',
    labelKey: 'tabs.meditate',
    focusedIcon: 'headset',
    unfocusedIcon: 'headset-outline',
  },
  {
    name: 'Prayer',
    labelKey: 'tabs.prayer',
    focusedIcon: 'heart',
    unfocusedIcon: 'heart-outline',
  },
  {
    name: 'More',
    labelKey: 'tabs.more',
    focusedIcon: 'ellipsis-horizontal',
    unfocusedIcon: 'ellipsis-horizontal-outline',
  },
];
