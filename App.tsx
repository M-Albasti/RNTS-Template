/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import _ from 'lodash';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

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

export default App;
