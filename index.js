/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@config/gesture-handler.native';
import '@translation/i18n';
import {setupApiMocks} from '@config/network/setupMocks';

setupApiMocks();

AppRegistry.registerComponent(appName, () => App);
