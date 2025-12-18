import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { ExitIcon, FullBodyIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { closeAllInstances, useVault, useVaults } from 'pearpass-lib-vault'
import { ActivityIndicator } from 'react-native'
import { NAVIGATION_ROUTES } from 'src/constants/navigation'

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
import { BottomSheetFolderMenuContent } from '../BottomSheetFolderMenuContent'
import { FolderList } from '../FolderList'
import { AddDeviceModalContent } from '../Modal/AddDeviceModalContent'
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

  const allVaults = useMemo(() => vaultsData || [], [vaultsData])

  const addDevice = () => {
    openModal(<AddDeviceModalContent onClose={closeModal} />)

    navigation.closeDrawer()
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

  const handleCreateVault = () => {
    const rootNavigation = navigation.getParent()?.getParent()
    if (rootNavigation) {
      rootNavigation.navigate('Welcome', {
        state: NAVIGATION_ROUTES.CREDENTIALS
      })
    }
    navigation.closeDrawer()
  }

  return (
    <DrawerContainer>
      <DrawerTitle>{t`Folder & Vault`}</DrawerTitle>
      <DropdownSwapVault
        onVaultSwap={swapVault}
        onCreateVault={handleCreateVault}
        vaults={allVaults}
        selectedVault={vaultData}
      />

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
        <ButtonThin onPress={addDevice} startIcon={FullBodyIcon}>
          {t`Add Device`}
        </ButtonThin>

        <ButtonThin onPress={closeVault} startIcon={ExitIcon}>
          {t`Close Vault`}
        </ButtonThin>
      </ActionsContainer>
    </DrawerContainer>
  )
}
