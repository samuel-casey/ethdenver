// Frameworks
import * as _ from 'lodash';

import { getChainNameById } from './getChainNameById';
import { GLOBALS } from '../../utils/globals';

export const getRpcUrl = (chainId, type = 'alchemy') => {
  const chainName = getChainNameById(chainId);

  let url, apiKey;
  switch (_.toLower(type)) {
    case 'etherscan':
      url = GLOBALS.ETHERSCAN_RPC_URL;
      apiKey = GLOBALS.ETHERSCAN_APIKEY;
      break;
    case 'alchemy':
      url = GLOBALS.ALCHEMY_RPC_URL;
      apiKey = GLOBALS.ALCHEMY_APIKEY;
      break;
    default:
      url = GLOBALS.INFURA_RPC_URL;
      apiKey = GLOBALS.INFURA_APIKEY;
      break;
  }

  return url.replace('{chainName}', chainName).replace('{apiKey}', apiKey);
};
