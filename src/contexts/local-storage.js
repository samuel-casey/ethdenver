// Frameworks
import React, { createContext, useEffect, useCallback, useContext, useReducer, useMemo } from 'react';
import window from 'global';

// App Components
import { GLOBALS } from '../utils/globals';


const LOCAL_STORAGE_KEY = 'DAPP_LS';

const initialState = {
  'VERSION': GLOBALS.CODE_VERSION,

  apolloCache: {
    chainId: GLOBALS.CHAIN_ID,
  },

  covalentNftBalances: [],

  cachedWallet: '',
  streamTxHash: '',
};
export const LocalStorageContext = createContext(initialState);

function initStorage() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    if (parsed.VERSION !== GLOBALS.CODE_VERSION) {
      return initialState;
    } else {
      return { ...initialState, ...parsed };
    }
  } catch {
    return initialState;
  }
}

export function useLocalStorageContext() {
  return useContext(LocalStorageContext);
}

const LocalStorageReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_KEY':
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value
      };
    default:
      throw Error(`Unexpected action type in LocalStorageReducer: '${action.type}'.`);
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(LocalStorageReducer, void (0), initStorage);

  const updateKey = useCallback((key, value) => {
    dispatch({ type: 'UPDATE_KEY', payload: { key, value } });
  }, []);

  return (
    <LocalStorageContext.Provider value={useMemo(() => [state, { updateKey }], [state, updateKey])}>
      {children}
    </LocalStorageContext.Provider>
  );
}

export function Updater() {
  const [state] = useLocalStorageContext();

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...state,
      timestamp: Math.floor(Date.now() / 1000)
    }));
  });

  return null;
}