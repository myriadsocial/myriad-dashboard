import React, {useEffect} from 'react';

import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/client';
import {useRouter} from 'next/router';

import {Login} from 'src/components-v2/Login';
import AlertComponent from 'src/components/alert/Alert.component';
import {useAlertHook} from 'src/hooks/use-alert.hook';
import {Login as LoginLayout} from 'src/layout/Login';
import {healthcheck} from 'src/lib/api/healthcheck';

export default function Index() {
  const {query} = useRouter();

  const {showAlert} = useAlertHook();

  useEffect(() => {
    if (query.error) {
      showAlert({
        message: 'Something wrong when try to loggedin.',
        severity: 'error',
        title: 'Login failed',
      });
    }
  }, [query.error]);

  return (
    <>
      <LoginLayout>
        <Login />
        <AlertComponent />
      </LoginLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {res} = context;

  const available = await healthcheck();

  if (!available) {
    res.setHeader('location', '/maintenance');
    res.statusCode = 302;
    res.end();
  }

  const session = await getSession(context);

  if (session) {
    res.setHeader('location', '/home');
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {},
  };
};
