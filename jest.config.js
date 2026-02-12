export default {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^pearpass-lib-ui-theme-provider/native$':
      '<rootDir>/node_modules/pearpass-lib-ui-theme-provider/native/index.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/packages/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|react-redux|@reduxjs/toolkit|immer|styled-components|@testing-library/react-native|expo-local-authentication|pearpass-lib-ui-react-native-components|pearpass-lib-ui-theme-provider|pearpass-lib-ui-theme-provider/native|pearpass-utils-password-check|@react-navigation/bottom-tabs|@gorhom/bottom-sheet|pearpass-utils-password-generator|expo-clipboard|expo-haptics|expo-document-picker|expo-file-system|expo-modules-core|wdk-react-native-passkey-internal|react-native-passkey|axios|crypto-js|react-native-config|pearpass-lib-data-export|pearpass-lib-constants|react-native-toast-message|react-native-reanimated)/)'
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
}
