import { ConfigPlugin } from '@expo/config-plugins';
export interface AutofillPluginOptions {
    ios: {
        appGroupIdentifier: string;
    };
    extensionBundlePath?: string;
}
declare const withAutofillPlugin: ConfigPlugin<AutofillPluginOptions>;
export default withAutofillPlugin;
