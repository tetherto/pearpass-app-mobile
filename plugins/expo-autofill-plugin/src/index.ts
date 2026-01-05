import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withIosAutofillExtension } from './ios/withIosAutofillExtension';
import { withIosPodfile } from './ios/withIosPodfile';
import { withIosAutofillModule } from './ios/withIosAutofillModule';
import { withAndroidAutofillService } from './android/withAndroidAutofillService';
import { withAndroidManifest } from './android/withAndroidManifest';
import { withAndroidAutofillModule } from './android/withAndroidAutofillModule';

export interface AutofillPluginOptions {
  ios: {
    appGroupIdentifier: string;
  };
  extensionBundlePath?: string;
}

const withAutofillPlugin: ConfigPlugin<AutofillPluginOptions> = (config, options) => {
  return withPlugins(config, [
    // iOS
    [withIosAutofillExtension, options],
    [withIosPodfile, options],
    [withIosAutofillModule, options],
    // Android
    [withAndroidAutofillService, options],
    [withAndroidManifest, options],
    [withAndroidAutofillModule, options],
  ]);
};

export default withAutofillPlugin;
