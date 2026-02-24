import { useCallback } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  BackIcon,
  DeleteIcon,
  KebabMenuIcon,
  MoveToIcon,
  SearchIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useRecords } from 'pearpass-lib-vault'
import { TouchableOpacity } from 'react-native'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { LogoLock } from '../../svgs/LogoLock'
import { BottomSheetFolderListContent } from '../BottomSheetFolderListContent'
import { BottomSheetToolbarActionsContent } from '../BottomSheetToolbarActionsContent'
import {
  InputContainer,
  KebabMenuButton,
  LockContainer,
  MultiSelectActions,
  SearchContainer,
  SearchCountWrapper,
  SearchTextInput
} from './styles'
import { ButtonLittle } from '../../libComponents'
import { ConfirmModalContent } from '../Modal/ConfirmModalContent'

export const Header = ({
  setSearchValue,
  searchValue,
  itemsFound,
  selectedRecords,
  setSelectedRecords,
  setIsMultiSelectOn,
  isMultiSelectOn
}) => {
  const navigation = useNavigation()

  const { openModal, closeModal } = useModal()

  const { t } = useLingui()

  const { expand, collapse } = useBottomSheet()

  const { deleteRecords, updateFolder } = useRecords({
    onCompleted: () => {
      closeModal()
      collapse?.()
    }
  })

  const handleDeleteConfirm = useCallback(async () => {
    await deleteRecords(selectedRecords)
  }, [selectedRecords])

  const handleDelete = useCallback(() => {
    openModal(
      <ConfirmModalContent
        title={t`Delete item`}
        text={t`Are you sure you want to delete this item?`}
        secondaryAction={closeModal}
        primaryAction={handleDeleteConfirm}
      />
    )
  }, [ConfirmModalContent, handleDeleteConfirm])

  const handleFolderMoveSelect = useCallback(
    async (folder) => {
      await updateFolder(selectedRecords, folder.name)
    },
    [selectedRecords]
  )

  const handleUpdateFolder = () => {
    expand({
      children: (
        <BottomSheetFolderListContent onFolderSelect={handleFolderMoveSelect} />
      ),
      snapPoints: ['10%', '25%', '25%']
    })
  }

  if (isMultiSelectOn) {
    return (
      <SearchContainer>
        <ButtonLittle
          startIcon={BackIcon}
          borderRadius="md"
          variant="secondary"
          onPress={() => {
            setIsMultiSelectOn(false)
            setSelectedRecords([])
          }}
        />
        <MultiSelectActions>
          <TouchableOpacity onPress={handleUpdateFolder}>
            <MoveToIcon color={colors.primary400.mode1} size="21" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete}>
            <DeleteIcon color={colors.primary400.mode1} size="21" />
          </TouchableOpacity>
        </MultiSelectActions>
      </SearchContainer>
    )
  }

  return (
    <SearchContainer>
      <LockContainer testID="logo-lock" onPress={() => navigation.openDrawer()}>
        <LogoLock width={30} height={40} />
      </LockContainer>

      <InputContainer
        testID="search-field"
        accessibilityLabel={t`Search field`}
      >
        <SearchIcon
          size={21}
          testID="search-field-icon"
          accessibilityLabel={t`Search field icon`}
        />

        <SearchTextInput
          testID="search-field-input"
          accessibilityLabel={t`Search field input`}
          placeholder={t`Search...`}
          placeholderTextColor={colors.grey100.mode1}
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <SearchCountWrapper>
          {searchValue ? itemsFound : ''}{' '}
        </SearchCountWrapper>
      </InputContainer>

      <KebabMenuButton
        onPress={() =>
          expand({
            children: (
              <BottomSheetToolbarActionsContent
                setIsMultiSelectOn={setIsMultiSelectOn}
              />
            ),
            snapPoints: ['10%', '20%, 20%']
          })
        }
      >
        <KebabMenuIcon size={21} />
      </KebabMenuButton>
    </SearchContainer>
  )
}
