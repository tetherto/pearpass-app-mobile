import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withNativeClipboardIOS } from './ios/withNativeClipboardIOS';
import { withNativeClipboardAndroid } from './android/withNativeClipboardAndroid';

const withNativeClipboard: ConfigPlugin = (config) => {
  return withPlugins(config, [
    withNativeClipboardIOS,
    withNativeClipboardAndroid,
  ]);
};

export default withNativeClipboard;
