import { useCallback, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  ExpandMore,
  FolderCopy,
  KeyboardArrowRightFilled,
  Layers,
  LockFilled,
  SwapVert
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { ScrollView, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { createStyles } from './styles'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { BottomSheetCategorySelectorContent } from '../BottomSheetCategorySelectorContent'
import { BottomSheetFolderSelectorContent } from '../BottomSheetFolderSelectorContent'
import { BottomSheetSortContentV2 } from '../BottomSheetSortContentV2'
import { BottomSheetVaultSelectorContent } from '../BottomSheetVaultSelectorContent'

const BreadcrumbFade = ({ side, bgColor }) => {
  const [height, setHeight] = useState(0)
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 24
      }}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      {height > 0 && (
        <Svg width={24} height={height}>
          <Defs>
            <LinearGradient
              id={`breadcrumb-fade-${side}`}
              x1={side === 'left' ? '1' : '0'}
              y1="0"
              x2={side === 'left' ? '0' : '1'}
              y2="0"
            >
              <Stop offset="0" stopColor={bgColor} stopOpacity="0" />
              <Stop offset="0.55" stopColor={bgColor} stopOpacity="0.7" />
              <Stop offset="1" stopColor={bgColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="24"
            height={height}
            fill={`url(#breadcrumb-fade-${side})`}
          />
        </Svg>
      )}
    </View>
  )
}

export const ContentHeader = ({
  isMultiSelectOn,
  recordType,
  onCategoryChange
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const navigation = useNavigation()
  const { data: vaultData } = useVault()
  const { state } = useSharedFilter()
  const styles = createStyles(theme.colors)
  const menuItems = useRecordMenuItems({ exclude: ['password'] })

  const bgColor = theme.colors.colorSurfacePrimary
  const vaultName = vaultData?.name || t`Personal Vault`
  const folderLabel =
    state?.folder === 'favorite'
      ? t`Favorites`
      : state?.folder && state?.folder !== 'allFolder'
        ? state.folder
        : t`All Folders`

  const handleCreateVault = useCallback(() => {
    navigation.navigate('Welcome', { state: 'credentials' })
  }, [navigation])

  const renderBreadcrumbPill = (icon, label) => (
    <View style={styles.breadcrumbPill} accessibilityLabel={label}>
      {icon}
      <Text variant="labelEmphasized">{label}</Text>
      <ExpandMore
        width={16}
        height={16}
        color={theme.colors.colorTextPrimary}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.breadcrumbScroll}
        >
          {isMultiSelectOn ? (
            <>
              <View style={styles.breadcrumbText}>
                <Text variant="labelEmphasized">
                  {menuItems.find((i) => i.type === recordType)?.name ??
                    t`All Items`}
                </Text>
              </View>
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              <View style={styles.breadcrumbText}>
                <Text variant="labelEmphasized">{folderLabel}</Text>
              </View>
            </>
          ) : (
            <>
              <ContextMenu
                trigger={renderBreadcrumbPill(
                  <LockFilled
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />,
                  vaultName
                )}
              >
                <BottomSheetVaultSelectorContent
                  onCreateVault={handleCreateVault}
                />
              </ContextMenu>

              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>

              <ContextMenu
                trigger={renderBreadcrumbPill(
                  <Layers
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />,
                  menuItems.find((i) => i.type === recordType)?.name ??
                    t`All Items`
                )}
              >
                <BottomSheetCategorySelectorContent
                  recordType={recordType}
                  onSelect={onCategoryChange}
                />
              </ContextMenu>

              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>

              <ContextMenu
                trigger={renderBreadcrumbPill(
                  <FolderCopy
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />,
                  folderLabel
                )}
              >
                <BottomSheetFolderSelectorContent />
              </ContextMenu>
            </>
          )}
        </ScrollView>
        <BreadcrumbFade side="left" bgColor={bgColor} />
        <BreadcrumbFade side="right" bgColor={bgColor} />
      </View>

      <View style={styles.buttonSection}>
        <ContextMenu
          trigger={
            <Button
              variant="tertiary"
              iconBefore={<SwapVert color={theme.colors.colorTextPrimary} />}
              aria-label={t`Sort items`}
            />
          }
        >
          <BottomSheetSortContentV2 />
        </ContextMenu>
      </View>
    </View>
  )
}
