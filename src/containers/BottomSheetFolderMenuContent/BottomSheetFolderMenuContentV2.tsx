import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  InputField,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Close,
  Edit,
  MoreVert,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from './BottomSheetFolderMenuContentV2Styles'
import { useNavigation } from '@react-navigation/native'
import type { NavigationProp } from '@react-navigation/native'
import { useFolders } from '@tetherto/pearpass-lib-vault'

const imageRegex = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|tiff?)$/i

interface BottomSheetFolderMenuContentV2Props {
  folderName: string
}

export const BottomSheetFolderMenuContentV2 = ({
  folderName
}: BottomSheetFolderMenuContentV2Props) => {
  const { theme } = useTheme()
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()

  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>()
  const { deleteFolder } = useFolders()

  return (
    <ContextMenu
      trigger={
        <Button
          variant="tertiary"
          size="medium"
          aria-label="More options"
          iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
        />
      }
    >
      <View style={{ paddingBottom: bottom }}>
        <NavbarListItem
          label="Rename"
          onClick={() =>
            navigation.navigate('CreateFolder', {
              initialValues: { title: folderName }
            })
          }
          icon={<Edit color={theme.colors.colorTextPrimary} />}
          showDivider
        />
        <NavbarListItem
          label="Delete"
          variant="destructive"
          onClick={() => {
            navigation.navigate('DeleteFolder', {
              folderName
            })
          }}
          icon={
            <TrashOutlined
              color={theme.colors.colorSurfaceDestructiveElevated}
            />
          }
          showDivider
        />
      </View>
    </ContextMenu>
  )
}
