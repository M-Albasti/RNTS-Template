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
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {wrap} from '@sentry/react-native';

//* navigators import
import NavigationScreens from '@navigation/index';

//* redux import
import {persistor, store} from '@redux/store';

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.container}>
            <NavigationScreens />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default wrap(App);
