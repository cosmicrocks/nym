import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ConnectWallet } from './wallet/connect';
import { SendTokes } from './wallet/sendTokens';
import { Delegations } from './wallet/delegations';
import { WalletContextProvider, useWalletContext } from './wallet/utils/wallet.context';

export const LogUI = () => {
  const { log } = useWalletContext();
  React.useEffect(() => {
    console.log('log', log);
  }, [log]);
  return (
    log.length > 0 && (
      <Box marginTop={3}>
        <Typography variant="h5">Transaction Logs:</Typography>
        {log}
      </Box>
    )
  );
};

export const Log = () => (
  <WalletContextProvider>
    <LogUI />
  </WalletContextProvider>
);

export const Wallet = ({ type }: { type: 'connect' | 'sendTokens' | 'delegations' | 'logs' }) => {
  const [component, setComponent] = React.useState<React.ReactNode>();

  React.useEffect(() => {
    switch (type) {
      case 'connect':
        setComponent(<ConnectWallet />);
        break;
      case 'sendTokens':
        setComponent(<SendTokes />);
        break;
      case 'delegations':
        setComponent(<Delegations />);
        break;
      default:
        null;
    }
  }, [type]);
  return (
    <WalletContextProvider>
      <Box padding={3}>{component}</Box>
    </WalletContextProvider>
  );
};
