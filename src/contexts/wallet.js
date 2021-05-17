// Frameworks
import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import * as _ from 'lodash';

// App components
import Wallet from '../utils/walletInstance';
import { useLocalStorageContext } from './local-storage';
import { GLOBALS } from '../utils/globals';

const initialState = {
  allReady: false,  // DEPRECATED; use: isWalletReady or isNetworkReady
  timestamp: 0,
  providerName: '',

  isProviderReady: false, // Web3 Provider Connected
  isNetworkReady: false, // Web3 Provider Connected to Correct Network
  isWalletReady: false, // Web3 Wallet Connected

  connectedNetworkId: 0,
  preferredNetworkId: _.parseInt(GLOBALS.CHAIN_ID, 10),

  // Connected Wallet
  connectedAddress: '',
  connectedAddressName: '',
  connectedBalance: '',
  connectionState: {},

  // Wallet Dialog State
  isWalletDialogOpen: false,

  // Connected Wallet (old)
  // connectedType       : '', // Wallet Connected if not Empty
  // connectedAddress    : '',
  // connectedName       : '',
  // connectedBalance    : 0,
};

export const WalletContext = createContext(initialState);

export function useWalletContext() {
  return useContext(WalletContext);
}

const WalletReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_WALLET_DIALOG':
      return {
        ...state,
        isWalletDialogOpen: action.payload.isWalletDialogOpen,
      };
    case 'UPDATE_CONNECTED_NETWORK':
      const connectedNetworkId = _.parseInt(action.payload, 10);
      return {
        ...state,
        connectedNetworkId,
        isProviderReady: (connectedNetworkId > 0),
        isNetworkReady: (connectedNetworkId === state.preferredNetworkId),
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        allReady: (!_.isEmpty(action.payload.address)),     // DEPRECATED; use: isWalletReady or isNetworkReady
        isWalletReady: !_.isEmpty(action.payload.address),
        connectedAddress: action.payload.address,
        connectedAddressName: action.payload.name,
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        connectedBalance: action.payload,
      };
    case 'UPDATE_TIMESTAMP':
      return {
        ...state,
        timestamp: action.payload,
      };
    case 'UPDATE_PROVIDER_NAME':
      return {
        ...state,
        providerName: action.payload.providerName,
      };
    case 'CONNECTION_STATE':
      return {
        ...state,
        connectionState: action.payload,
      };
    case 'RESET':
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(WalletReducer, initialState);
  return (
    <WalletContext.Provider value={[state, dispatch]}>
      {children}
    </WalletContext.Provider>
  );
}

export function Updater() {
  const wallet = useMemo(() => Wallet.instance(), []);
  const [walletState, walletDispatch] = useWalletContext();
  const { connectedNetworkId, preferredNetworkId } = walletState;

  const [cacheState, cacheDispatch] = useLocalStorageContext();
  const cachedWallet = cacheState.cachedWallet;
  const updateCache = cacheDispatch.updateKey;

  // Prepare Wallet Interface
  useEffect(() => {
    //// Wallet class init
    wallet.init({ walletDispatch, updateCache, cachedWallet });

    //// CONTRACT ADDRESSES ////

    //// PREPARE CONTRACTS ////

  }, [wallet, preferredNetworkId, walletDispatch, updateCache, cachedWallet]);


  // Monitor for Valid Wallet & Network
  useEffect(() => {}, [connectedNetworkId, preferredNetworkId, walletDispatch]);

  return null;
};