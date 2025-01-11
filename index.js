/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
console.log = () => {};
console.warn = () => {};
console.error = () => {};
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
