import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { ExitIcon, FullBodyIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { closeAllInstances, useVault, useVaults } from 'pearpass-lib-vault'
import { ActivityIndicator } from 'react-native'

import {
  ActionsContainer,
  DrawerContainer,
  DrawerTitle,
  LoadingWrapper,
  ScrollContainer,
  ScrollView
} from './styles'
import { DropdownSwapVault } from '../../components/DropdownSwapVault'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { ButtonThin } from '../../libComponents'
import { clearAllFileCache } from '../../utils/filesCache'
import { BottomSheetAddDeviceContent } from '../BottomSheetAddDeviceContent'
import { BottomSheetFolderMenuContent } from '../BottomSheetFolderMenuContent'
import { FolderList } from '../FolderList'
import { VaultPasswordFormModalContent } from '../Modal/VaultPasswordFormModalContent'

/**
 * @param {{
 *  navigation: DrawerNavigationHelpers
 * }} props
 */
export const DrawerContent = ({ navigation }) => {
  const { t } = useLingui()
  const { openModal, closeModal } = useModal()
  const { expand } = useBottomSheet()
  const { setState, state } = useSharedFilter()
  const [isClosing, setIsClosing] = useState(false)

  const { data: vaultsData, resetState } = useVaults()

  const {
    data: vaultData,
    isVaultProtected,
    refetch: refetchVault
  } = useVault()

  const filteredVaults = useMemo(
    () => vaultsData?.filter((vault) => vault?.id !== vaultData?.id),
    [vaultsData, vaultData]
  )

  const addDevice = () => {
    navigation.closeDrawer()
    expand({
      children: <BottomSheetAddDeviceContent />,
      snapPoints: ['10%', '85%', '85%']
    })
  }

  const handleUnlockVault = async ({ vault, password }) => {
    if (!vault?.id) {
      return
    }

    try {
      await refetchVault(vault?.id, { password })

      closeModal()
    } catch (error) {
      throw error
    }
  }

  const swapVault = async (vault) => {
    const isProtected = await isVaultProtected(vault?.id)

    if (isProtected) {
      openModal(
        <VaultPasswordFormModalContent
          vault={vault}
          onSubmit={async (password) => {
            await handleUnlockVault({ vault, password })
          }}
        />
      )
    } else {
      await refetchVault(vault?.id)
    }

    navigation.closeDrawer()
  }

  const closeVault = async () => {
    setIsClosing(true)
    await closeAllInstances()
    clearAllFileCache()
    setIsClosing(false)
    navigation.replace('Welcome')
    resetState()
  }

  if (isClosing) {
    return (
      <DrawerContainer>
        <LoadingWrapper>
          <ActivityIndicator size="large" color={colors.primary400.mode1} />
        </LoadingWrapper>
      </DrawerContainer>
    )
  }

  const handleFolderMenuOpen = (folderName) => {
    if (folderName !== 'Favorites' && folderName !== 'All Folders') {
      expand({
        children: <BottomSheetFolderMenuContent folderName={folderName} />,
        snapPoints: ['10%', '20%', '20%']
      })
    }
  }

  return (
    <DrawerContainer testID="sidebar-screen">
      <DrawerTitle testID="sidebar-title">{t`Folder`}</DrawerTitle>
      <ScrollContainer>
        <ScrollView>
          <FolderList
            isFilter
            selectedFolder={state?.folder}
            onLongPress={handleFolderMenuOpen}
            onFolderSelect={(folder) => {
              setState({
                folder: folder?.id ?? folder.name,
                isFavorite: folder?.id && folder?.id === 'favorite',
                sort: 'recent'
              })
              navigation.closeDrawer()
            }}
          />
        </ScrollView>
      </ScrollContainer>
      <ActionsContainer>
        <DropdownSwapVault
          onVaultSwap={swapVault}
          vaults={filteredVaults}
          selectedVault={vaultData}
        />
        <ButtonThin
          onPress={addDevice}
          startIcon={FullBodyIcon}
          testID="sidebar-add-device-button"
          textTestID="sidebar-add-device-text"
        >
          {t`Add Device`}
        </ButtonThin>

        <ButtonThin
          onPress={closeVault}
          startIcon={ExitIcon}
          testID="sidebar-close-vault-button"
          textTestID="sidebar-close-vault-text"
        >
          {t`Close Vault`}
        </ButtonThin>
      </ActionsContainer>
    </DrawerContainer>
  )
}
