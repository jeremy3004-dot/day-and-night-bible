import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootTabParamList } from './types';

export type PendingAuthMode = 'SignIn' | 'SignUp';

export const rootNavigationRef = createNavigationContainerRef<RootTabParamList>();

let queuedAuthMode: PendingAuthMode | null = null;

const buildAuthRoute = (mode: PendingAuthMode) =>
  ({
    screen: 'Auth',
    params: {
      screen: mode,
    },
  }) as const;

export const openAuthFlow = (mode: PendingAuthMode): void => {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate('More', buildAuthRoute(mode));
    return;
  }

  queuedAuthMode = mode;
};

export const flushQueuedAuthFlow = (): void => {
  if (!queuedAuthMode || !rootNavigationRef.isReady()) {
    return;
  }

  const mode = queuedAuthMode;
  queuedAuthMode = null;
  rootNavigationRef.navigate('More', buildAuthRoute(mode));
};
