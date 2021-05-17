// Frameworks
import * as _ from 'lodash';

export const getChainNameById = (chainId) => {
  switch (_.parseInt(chainId, 10)) {
    case 1:
      return 'mainnet';
    case 3:
      return 'ropsten';
    case 4:
      return 'rinkeby';
    case 5:
      return 'goerli';
    case 42:
      return 'kovan';
    default:
      return 'development';
  }
};