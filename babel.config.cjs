const reactStrictPreset = require('react-strict-dom/babel-preset');

function getPlatform(caller) {
  return caller && caller.platform;
}

function getIsDev(caller) {
  if (caller?.isDev != null) return caller.isDev;
  return (
    process.env.BABEL_ENV === 'development' ||
    process.env.NODE_ENV === 'development'
  );
}

module.exports = function (api) {
  const platform = api.caller(getPlatform);
  const dev = api.caller(getIsDev);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { node: 'current' },
          modules: 'commonjs'
        }
      ],
      'babel-preset-expo',
      [
        reactStrictPreset,
        {
          debug: dev,
          dev,
          platform
        }
      ]
    ],
    plugins: ['macros', 'react-native-worklets-core/plugin']
  }
}
