import { useLingui } from '@lingui/react/macro'
import {
  Button,
  NavbarListItem,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  ArrowBackOutined,
  Close,
  EditOutlined,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

interface BottomSheetFolderMenuContentV2Props {
  folderName: string
  onBack: () => void
  onClose: () => void
  onRename: (folderName: string) => void
  onDelete: (folderName: string) => void
}

export const BottomSheetFolderMenuContentV2 = ({
  folderName,
  onBack,
  onClose,
  onRename,
  onDelete
}: BottomSheetFolderMenuContentV2Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  return (
    <View
      style={[
        styles.content,
        {
          backgroundColor: theme.colors.colorSurfacePrimary
        }
      ]}
    >
      <View style={styles.header}>
        <Button
          variant="tertiary"
          size="medium"
          aria-label={t`Back`}
          iconBefore={<ArrowBackOutined color={theme.colors.colorTextPrimary} />}
          onClick={onBack}
        />

        <View style={styles.title}>
          <Text variant="bodyEmphasized">
            {folderName}
          </Text>
        </View>

        <Button
          variant="tertiary"
          size="medium"
          aria-label={t`Close`}
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={onClose}
        />
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.colorBorderPrimary }
        ]}
      />

      <NavbarListItem
        platform="mobile"
        label={t`Rename`}
        onClick={() => onRename?.(folderName)}
        icon={<EditOutlined color={theme.colors.colorTextPrimary} />}
        showDivider
      />
      <NavbarListItem
        platform="mobile"
        label={t`Delete Folder`}
        variant="destructive"
        onClick={() => onDelete?.(folderName)}
        icon={
          <TrashOutlined color={theme.colors.colorSurfaceDestructiveElevated} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8,
    gap: rawTokens.spacing8
  },
  title: {
    flex: 1,
    alignItems: 'center'
  },
  divider: {
    height: 1,
    marginHorizontal: rawTokens.spacing16
  }
})
