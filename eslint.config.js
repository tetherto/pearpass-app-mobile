import { eslintConfig } from '@tetherto/tether-dev-docs'
import eslintConfigExpo from 'eslint-config-expo'

export default [
  {
    plugins: {
      expo: eslintConfigExpo
    }
  },
  ...eslintConfig
]
