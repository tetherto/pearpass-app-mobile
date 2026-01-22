import { ConfigPlugin, withMainActivity as withMainActivityMod } from '@expo/config-plugins';

export const withMainActivity: ConfigPlugin = (config) => {
  return withMainActivityMod(config, (cfg) => {
    let contents = cfg.modResults.contents;

    // Add CustomSplashScreenView.show(this) after super.onCreate(null) if not present
    if (!contents.includes('CustomSplashScreenView.show(this)')) {
      contents = contents.replace(
        /super\.onCreate\(null\)/,
        `super.onCreate(null)
    CustomSplashScreenView.show(this)`
      );
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
};
