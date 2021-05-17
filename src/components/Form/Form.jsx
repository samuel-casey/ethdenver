import React, { useState } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// App Components
import Wallet from '../../utils/walletInstance';
import { useWalletContext } from '../../contexts/wallet';

const Form = ({ onSubmit }) => {
  
  const [walletState, walletDispatch] = useWalletContext();
  
  const initialFormData = {
    name: '',
    imgUrl: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const _handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData(initialFormData);
  };

  const _handleChange = (event) => {
    event.preventDefault();
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const _handleConnectWalletClick = () => {
    Wallet.instance().selectWallet(null);
  };

  if (!walletState.isWalletReady) {
    return (
      <Button onClick={_handleConnectWalletClick}>Connect Wallet</Button>
    );
  };
   
  return (
    <form onSubmit={_handleSubmit}>
      <Grid container direction="column" spacing={16}>
        <label>Name</label>
        <input
          id='name'
          value={formData.name}
          onChange={_handleChange}
        />
          
        <br />
        <br />
          
        <label>Image URL</label>
        <input
          id='imgUrl'
          value={formData.imgUrl}
          onChange={_handleChange}
        />
          
        <br />
        <br />
        
        <input type="submit" value="Create New Gravatar" />
      </Grid>
    </form>
  );
};

export default Form;