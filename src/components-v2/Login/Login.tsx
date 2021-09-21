import React, {useEffect, useState} from 'react';

import {Button, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {ChooseAccountComponent} from '../../components/login/modal-accounts.component';
import {NoExtensionComponent} from '../../components/login/modal-no-extension.component';
import {useAuthHook} from '../../hooks/auth.hook';
import {usePolkadotExtension} from '../../hooks/use-polkadot-app.hook';
import {useStyles} from './Login.styles';

export const Login: React.FC = () => {
  const styles = useStyles();

  const {enablePolkadotExtension, getPolkadotAccounts} = usePolkadotExtension();
  const {signInWithAccount, anonymous} = useAuthHook();

  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    if (extensionInstalled) {
      getAvailableAccounts();
    }
  }, [extensionInstalled]);

  const getAvailableAccounts = async () => {
    const accounts = await getPolkadotAccounts();

    setAccounts(accounts);
  };

  const checkExtensionInstalled = async () => {
    const installed = await enablePolkadotExtension();

    setSignIn(true);
    setExtensionInstalled(installed);
  };

  const toggleModal = () => {
    setSignIn(false);
  };

  return (
    <>
      <Button
        className={styles.button}
        color="primary"
        variant="contained"
        onClick={checkExtensionInstalled}>
        Sign in
      </Button>
      <Typography className={styles.span} component="span">
        Or try our{' '}
        <Button className={styles.link} onClick={anonymous}>
          demo
        </Button>
        first
        <span role="img" aria-label="emoticon-peace">
          ✌️
        </span>
      </Typography>

      <NoExtensionComponent isOpen={signIn && !extensionInstalled} onClose={toggleModal} />
      <ChooseAccountComponent
        isOpen={signIn && extensionInstalled}
        accounts={accounts}
        onSelect={signInWithAccount}
        onClose={toggleModal}
      />
    </>
  );
};
