// Frameworks
import * as _ from 'lodash';

const Helpers = {}

Helpers.getFriendlyAddress = ({ address, digits = 4, separator = '...', prefix = '0x' }) => {
  return _.join(
    [
      ..._.slice(address, 0, digits + prefix.length),
      separator,
      ..._.slice(address, -digits),
    ],
    ''
  );
};

export { Helpers };