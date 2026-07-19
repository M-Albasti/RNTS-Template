/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//* config import
import '@config/sentryConfig';

//* packages import
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nextProvider} from 'react-i18next';
import {wrap} from '@sentry/react-native';

//* config import
import AppProviders from '@config/AppProviders';

//* navigators import
import NavigationScreens from '@navigation/index';

//* redux import
import {bootstrapSQLite} from '@redux/storage/sqlite';
import {initFirebaseServices} from '@config/firebaseInit';
import {persistor, store} from '@redux/store';

//* translation import
import i18n from '@translation/i18n';
import DriverBackgroundTrackingHost from '@organisms/delivery/DriverBackgroundTrackingHost';
import FirebaseMessagingHost from '@organisms/firebase/FirebaseMessagingHost';
import IslamicNotificationHost from '@organisms/islamic/IslamicNotificationHost';
import QuranAudioHost from '@organisms/islamic/QuranAudioHost';

declare global {
  // eslint-disable-next-line no-var
  var __RNTS_APP_BOOTSTRAPPED__: boolean | undefined;
}

const App = (): React.JSX.Element => {
  // Wait until SQLite is opened, migrated, and todos are loaded/seeded.
  const [sqliteReady, setSqliteReady] = useState(
    () => globalThis.__RNTS_APP_BOOTSTRAPPED__ === true,
  );

  useEffect(() => {
    if (globalThis.__RNTS_APP_BOOTSTRAPPED__) {
      setSqliteReady(true);
      return;
    }
    globalThis.__RNTS_APP_BOOTSTRAPPED__ = true;

    const boot = async () => {
      try {
        bootstrapSQLite(store.dispatch, store.getState);
        await initFirebaseServices();
      } catch (error) {
        console.log('App bootstrap Error =>', error);
      } finally {
        setSqliteReady(true);
      }
    };

    boot();
  }, []);

  if (!sqliteReady) {
    return <></>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppProviders>
            <SafeAreaProvider>
              <GestureHandlerRootView style={styles.container}>
                <DriverBackgroundTrackingHost />
                <FirebaseMessagingHost />
                <IslamicNotificationHost />
                <QuranAudioHost />
                <NavigationScreens />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </AppProviders>
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default wrap(App);
