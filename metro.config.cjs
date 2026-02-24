// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true
    }
  })
}

config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  assetExts: [
    ...config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    'bundle'
  ],
  sourceExts: [...config.resolver.sourceExts, 'svg', 'd.ts'],
  resolveRequest: (context, moduleName, platform) => {
    // kdbxweb's UMD bundle does require("crypto") at load time but
    // only uses it as a fallback when Web Crypto API is unavailable.
    // Return an empty module so Metro can bundle without Node built-ins.
    if (moduleName === 'crypto') {
      return { type: 'empty' }
    }
    return context.resolveRequest(context, moduleName, platform)
  }
}

module.exports = config
