/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import '@config/gesture-handler.native';
import '@translation/i18n';
import {setupApiMocks} from '@config/network/setupMocks';
import {handleFirebaseBackgroundMessage} from '@services/firebaseServices/firebaseMessagingService';
import {registerIslamicNotifeeHandlers} from '@services/islamicServices/islamicNotifeeHandlers';

setupApiMocks();
registerIslamicNotifeeHandlers();

messaging().setBackgroundMessageHandler(handleFirebaseBackgroundMessage);

AppRegistry.registerComponent(appName, () => App);
