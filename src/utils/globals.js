const GLOBALS = {}
  
GLOBALS.CHAIN_ID        = process.env.REACT_APP_CHAIN_ID;
GLOBALS.ONBOARD_DAPP_ID = process.env.REACT_APP_ONBOARD_DAPP_ID;

GLOBALS.ALCHEMY_APIKEY = process.env.REACT_APP_ALCHEMY_APIKEY;
GLOBALS.ALCHEMY_RPC_URL = process.env.REACT_APP_ALCHEMY_RPC_URL;

GLOBALS.INFURA_APIKEY = process.env.REACT_APP_INFURA_APIKEY;
GLOBALS.INFURA_RPC_URL = process.env.REACT_APP_INFURA_RPC_URL;

GLOBALS.AVAILABLE_WALLETS = {
  REQUIRE_RPC_URL: ['trust', 'ledger', 'trezor', 'walletLink', 'imToken', 'lattice', 'mykey', 'huobiwallet', 'wallet.io'],
  CONFIG: [
    { walletName: 'metamask', preferred: true },
    {
      walletName: 'portis',
      apiKey: GLOBALS.PORTIS_APIKEY,
      label: 'Email Login (Portis)',
      preferred: true
    },
    { walletName: 'ledger', preferred: true },
    {
      walletName: 'trezor',
      appUrl: GLOBALS.BASE_URL + GLOBALS.APP_ROOT,
      email: GLOBALS.CONTACT_EMAIL,
      preferred: true,
    },
    {
      walletName: 'walletConnect',
      infuraKey: GLOBALS.INFURA_APIKEY,
      preferred: true,
    },
    { walletName: 'coinbase' },
    { walletName: 'walletLink' },

    { walletName: 'trust' },
    {
      walletName: 'fortmatic',
      apiKey: process.env.GATSBY_FORTMATIC_API_KEY,
    },
    { walletName: 'authereum' },
    { walletName: 'torus' },
    { walletName: 'status' },
    {
      walletName: 'lattice',
      appName: GLOBALS.COMPANY_NAME
    },
    { walletName: 'opera' },
    { walletName: 'operaTouch' },
    { walletName: 'status' },
    { walletName: 'imToken' },
    { walletName: 'meetone' },
    { walletName: 'mykey' },
    { walletName: 'huobiwallet' },
    { walletName: 'hyperpay' },
    { walletName: 'wallet.io' },
    { walletName: 'atoken' }
  ]
};

export { GLOBALS };