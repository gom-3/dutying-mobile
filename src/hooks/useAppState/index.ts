import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(onChange: (state: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, [onChange]);
}
