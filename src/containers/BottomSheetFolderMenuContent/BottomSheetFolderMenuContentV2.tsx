import type { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  NavbarListItem,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Edit,
  MoreVert,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// const imageRegex = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|tiff?)$/i

interface BottomSheetFolderMenuContentV2Props {
  folderName: string
}

export const BottomSheetFolderMenuContentV2 = ({
  folderName
}: BottomSheetFolderMenuContentV2Props) => {
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>()

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
