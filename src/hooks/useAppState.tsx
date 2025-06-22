import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

export function useAppState() {
  const [state, setState] = useState(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', setState);
    return () => sub.remove();
  }, []);

  return state; // active | background | inactive
}
