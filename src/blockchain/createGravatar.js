import {ethers} from 'ethers';

// const isMetaMaskInstalled = () => {
//   const { ethereum } = window;
//   return Boolean(ethereum && ethereum.isMetaMask);
// }

// // TODO: Move to utils
const connectToEthereum = async () => {
  try {
    let provider;
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();  
    
    const connectedAddress = await signer.getAddress();
   
    if (provider && signer) {
      return { provider, signer };
    }
  } catch (err) {
    console.error(err)
  }
};

export const createGravatar = async ({  }) => {
  // get gravatar info
  // get contract address
  // get appropriate signer
  // send TX

  const { provider, signer } = await connectToEthereum();

  console.log(await signer.getAddress())

  // if (isConnected) {

  // }
};