import { useMemo } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'

import { MenuActionItem } from '../../components/MenuActionItem'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { ConfirmModalContent } from '../Modal/ConfirmModalContent'

/**
 * @param {{
 *  folderName: string
 * }} props
 */
export const BottomSheetFolderMenuContent = ({ folderName }) => {
  const navigation = useNavigation()
  // const { deleteFolder } = useFolders()
  const { collapse } = useBottomSheet()
  const { closeModal, openModal } = useModal()

  const menuItems = useMemo(
    () => [
      {
        name: 'Rename',
        type: 'rename',
        click: () => {
          collapse()
          navigation.navigate('CreateFolder', {
            initialValues: { title: folderName }
          })
        }
      },
      {
        name: 'Delete',
        type: 'delete',
        click: () => {
          openModal(
            <ConfirmModalContent
              title="Reset all data"
              text="Are you sure that you want to Reset all stored data?"
              secondaryAction={closeModal}
              primaryAction={() => {
                navigation.navigate('DeleteFolder', {
                  folderName
                })
                // deleteFolder(folderName)
                // closeModal()
                // collapse()
              }}
            />
          )
        }
      }
    ],
    []
  )

  return (
    <BottomSheetScrollView style={{ padding: 20 }}>
      {menuItems.map((item) => (
        <MenuActionItem key={item.name} item={item} onPress={item.click} />
      ))}
    </BottomSheetScrollView>
  )
}
