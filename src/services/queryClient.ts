import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Re-fetch stale queries when app returns to foreground
function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

// Track online/offline status via NetInfo (already installed)
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// Listen for app state changes — cleans up automatically when the module is
// garbage-collected, but in practice this module lives for the app lifetime.
AppState.addEventListener('change', onAppStateChange);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collect inactive queries)
    },
  },
});
