/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//* config import
import '@config/sentryConfig';

//* packages import
import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import { wrap } from '@sentry/react-native';

//* navigators import
import NavigationScreens from '@navigation/index';

//* redux import
import { persistor, store } from '@redux/store';

//* translation import
import i18n from '@translation/i18n';

const App = (): React.JSX.Element => {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
              <NavigationScreens />
            </GestureHandlerRootView>
          </SafeAreaProvider>
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
