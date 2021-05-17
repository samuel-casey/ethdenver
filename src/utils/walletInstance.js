// Frameworks
import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import ENS, { getEnsAddress as getEnsRegistry } from '@ensdomains/ensjs';
import * as _ from 'lodash';

// Internals
import { getChainNameById } from '../blockchain/helpers/getChainNameById';
import { getRpcUrl } from '../blockchain/helpers/getRpcUrl';
import { Helpers } from './helpers';
import { GLOBALS } from './globals';

class Wallet {
  constructor() {
    this._onBoard = null;
    this._walletDispatch = null;
    this._updateCache = null;
    this._readOnlyProvider = null;
    this._readOnlyWeb3 = null;
    this._provider = null;
    this._web3 = null;
  }

  static instance() {
    if (!Wallet.__instance) {
      Wallet.__instance = new Wallet();
    }
    return Wallet.__instance;
  }

  init({ walletDispatch, updateCache, cachedWallet }) {
    this._walletDispatch = walletDispatch;
    this._updateCache = updateCache;

    // Connect to Web3
    const { rpcUrl, chainId, chainName } = Wallet._getEnv();
    this._readOnlyProvider = Web3.givenProvider || new Web3.providers.HttpProvider(rpcUrl);
    this._readOnlyWeb3 = new Web3(this._readOnlyProvider);

    // Connect to ENS - only works on Mainnet since no ENS registrar/s resolver is set on Kovan
    this.ens = new ENS({ provider: this._readOnlyProvider, ensAddress: getEnsRegistry(`1`) });

    // Connect to Wallet
    const walletConfigs = _.map(GLOBALS.AVAILABLE_WALLETS.CONFIG, config => {
      if (_.includes(GLOBALS.AVAILABLE_WALLETS.REQUIRE_RPC_URL, config.walletName)) {
        config.rpcUrl = rpcUrl;
      }
      return config;
    });

    this._onBoard = Onboard({
      dappId: GLOBALS.ONBOARD_DAPP_ID,
      networkId: parseInt(chainId, 10),
      networkName: chainName,
      hideBranding: true,
      darkMode: true,
      walletSelect: {
        wallets: walletConfigs,
      },
      subscriptions: {
        address: (newAddress) => this.handleAddressChange(newAddress),
        balance: (newBalance) => this.handleBalanceChange(newBalance),
        network: (newNetwork) => this.handleNetworkChange(newNetwork),
        wallet: (newWallet) => this.handleWalletChange(newWallet)
      }
    });

    this.reconnectFromCache(cachedWallet);

    this._walletDispatch({
      type: 'UPDATE_CONNECTED_NETWORK',
      payload: chainId,
    });
  }

  async selectWallet(walletType) {
    // Select Wallet in OnBoard
    let walletSelected = await this._onBoard.walletSelect(walletType);

    // Confirm that a user selected/connected a wallet before running walletCheck or walletCheck will generate an unhandled exception
    if (!walletSelected) {
      return;
    }
    await this._onBoard.walletCheck();

    // Update Wallet State
    const currentState = this._onBoard.getState();
    if (currentState.wallet.type) {
      await this.connectWallet(currentState.wallet);

      this._walletDispatch({
        type: 'UPDATE_PROVIDER_NAME', payload: {
          providerName: currentState.wallet.name
        }
      });

      this._walletDispatch({ type: 'UPDATE_TIMESTAMP', payload: Date.now() });
    }
  }

  async connectWallet(newWallet) {
    this._provider = newWallet.provider;
    this._web3 = new Web3(this._provider);

    // Update LocalStorage Cache
    this._updateCache('cachedWallet', newWallet.name);
  }

  async disconnectWallet() {
    if (_.isFunction(this._updateCache)) {
      this._updateCache('cachedWallet', '');
    }
    this._walletDispatch({ type: 'RESET' });
  }

  async reconnectFromCache(cachedWallet) {
    if (!_.isEmpty(cachedWallet)) {
      await this.selectWallet(cachedWallet);
    }
  }

  async handleAddressChange(newAddress) {
    try {
      let address;
      let name;
      if (newAddress) {
        address = newAddress;
        name = await this.getEnsName(address);

        if (!_.isEmpty(address) && _.isEmpty(name)) {
          name = this.getFriendlyAddress({ address });
        }
      }
      this._walletDispatch({ type: 'UPDATE_ADDRESS', payload: { address, name } });
    }
    catch (e) {
      console.error(e);
    }
  }

  async handleBalanceChange(newBalance) {
    this._walletDispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
  }

  async handleNetworkChange(newNetworkId) {
    this._walletDispatch({ type: 'UPDATE_CONNECTED_NETWORK', payload: newNetworkId });
  }

  async handleWalletChange(newWallet) {
    // if (!newWallet.name) {
    //   await this.disconnectWallet();
    // } else {
    //   await this.connectWallet(newWallet);
    //   await this.handleAddressChange();
    // }
  }

  async getEnsName(address) {
    if (!this.ens) { return ''; }
    try {
      let res = await this.ens.getName(address);
      return res.name;
    }
    catch (err) {
      return '';
    }
  }

  async getEnsAddress(name) {
    if (!this.ens) { return ''; }
    try {
      return await this.ens.name(name).getAddress();
    }
    catch (err) {
      return '';
    }
  }

  getFriendlyAddress({ address, digits = 4, separator = '...' }) {
    return Helpers.getFriendlyAddress({ address, digits, separator });
  }

  async watchAsset(params, callback) {
    const payload = {
      params,
      method: 'wallet_watchAsset',
    };
    this._web3.currentProvider.sendAsync(payload, callback);
  }

  get walletIsMetamask() {
    return this._web3?.currentProvider?.isMetaMask || false;
  }

  get web3() {
    return this._web3;
  }

  get provider() {
    return this._provider;
  }

  get readOnlyWeb3() {
    return this._readOnlyWeb3;
  }

  get readOnlyProvider() {
    return this._readOnlyProvider;
  }

  static _getEnv() {
    const chainId = GLOBALS.CHAIN_ID;
    const chainName = getChainNameById(chainId);
    const rpcUrl = getRpcUrl(chainId);
    return { rpcUrl, chainId, chainName };
  }
}
Wallet.__instance = null;

export default Wallet;