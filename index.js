/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@config/gesture-handler.native';
import '@translation/i18n';
import {runAppEntrySetup} from '@config/appEntrySetup';

runAppEntrySetup();

AppRegistry.registerComponent(appName, () => App);
