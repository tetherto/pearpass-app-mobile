import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withSplashScreenIOS } from './ios/withSplashScreenIOS';
import { withSplashScreenAndroid } from './android/withSplashScreenAndroid';

const withCustomSplashScreen: ConfigPlugin = (config) => {
  return withPlugins(config, [
    withSplashScreenIOS,
    withSplashScreenAndroid,
  ]);
};

export default withCustomSplashScreen;
