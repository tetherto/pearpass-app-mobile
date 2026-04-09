import { isV2 } from './designVersion'

export const isModifyVaultModalV2Enabled = () =>
  isV2() && process.env.EXPO_PUBLIC_ENABLE_MODIFY_VAULT_MODAL_V2 === 'true'
