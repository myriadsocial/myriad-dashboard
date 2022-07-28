import getConfig from 'next/config';

import FirebaseApp from './app';

import firebase from 'firebase/app';
import 'firebase/messaging';
import localforage from 'localforage';
import {NotificationProps} from 'src/interfaces/notification';

export const init = async (onMessage?: (payload?: NotificationProps) => void) => {
  FirebaseApp.init();

  const messaging = firebase.messaging();
  const token = await messaging.getToken();

  await localforage.setItem('fcm_token', token);

  messaging.onMessage(
    function (payload: any) {
      const {publicRuntimeConfig} = getConfig();
      const appUrl = publicRuntimeConfig.appAuthURL ?? '';

      try {
        const notificationProps: NotificationProps = JSON.parse(payload?.data?.data);

        const {title, body} = payload?.data;

        navigator.serviceWorker
          .getRegistration('/firebase-cloud-messaging-push-scope')
          .then(registration => {
            registration.showNotification(title, {
              body,
              icon: appUrl + '/images/logo.jpg',
            });
          });

        onMessage && onMessage(notificationProps);
        // eslint-disable-next-line no-empty
      } catch (error) {
        onMessage && onMessage();
      }
    },
    error => {
      console.error('onMessageListener error', error);
    },
  );

  return token;
};

export const unregister = async () => {
  const messaging = firebase.messaging();

  messaging.deleteToken();
  await localforage.removeItem('fcm_token');
};
