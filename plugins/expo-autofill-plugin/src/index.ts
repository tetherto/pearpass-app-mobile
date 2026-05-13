import { ConfigPlugin, withPlugins } from '@expo/config-plugins';
import { withIosAutofillExtension } from './ios/withIosAutofillExtension';
import { withIosPodfile } from './ios/withIosPodfile';
import { withIosAutofillModule } from './ios/withIosAutofillModule';
import { withIosDesignVersion } from './ios/withIosDesignVersion';
import { withIosExtensionExceptions } from './ios/withIosExtensionExceptions';
import { withAndroidAutofillService } from './android/withAndroidAutofillService';
import { withAndroidManifest } from './android/withAndroidManifest';
import { withAndroidAutofillModule } from './android/withAndroidAutofillModule';
import { withAndroidDesignVersion } from './android/withAndroidDesignVersion';

export interface AutofillPluginOptions {
  ios: {
    appGroupIdentifier: string;
  };
  extensionBundlePath?: string;
}

const withAutofillPlugin: ConfigPlugin<AutofillPluginOptions> = (config, options) => {
  return withPlugins(config, [
    // iOS — Expo's withDangerousMod / withXcodeProject mods execute in reverse
    // registration order (each new call wraps the previous handler), so the
    // plugin registered LAST runs FIRST. withIosAutofillExtension owns the
    // template copy and the Xcode target setup, so it must run before plugins
    // that mutate the generated extension files (Info.plist) or the project's
    // synchronized-build exception sets — register it last.
    [withIosPodfile, options],
    [withIosAutofillModule, options],
    [withIosDesignVersion, options],
    [withIosExtensionExceptions, options],
    [withIosAutofillExtension, options],
    // Android
    [withAndroidAutofillService, options],
    [withAndroidManifest, options],
    [withAndroidAutofillModule, options],
    [withAndroidDesignVersion, options],
  ]);
};

export default withAutofillPlugin;
