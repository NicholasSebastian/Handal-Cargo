import { useState } from 'react';

function useSessionState<T>(key: string, initialValue?: T) {

  // Loading data from session to state.
  const getInitialState = (key: string): T => {
    const existingItem = sessionStorage.getItem(key);
    return existingItem ? JSON.parse(existingItem) : initialValue;
  }

  // The actual state.
  const [state, setState] = useState(getInitialState(key));

  // Setting data from state change to session.
  const setSessionState = (newState: T) => {
    sessionStorage.setItem(key, JSON.stringify(newState));
    setState(newState);
  }

  return [state, setSessionState] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useSessionState;
