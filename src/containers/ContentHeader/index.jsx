import { useCallback, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Checklist,
  ExpandMore,
  FilterList,
  FolderCopy,
  KeyboardArrowRightFilled,
  Layers,
  LockFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { Pressable, ScrollView, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { BottomSheetCategorySelectorContent } from '../BottomSheetCategorySelectorContent'
import { BottomSheetFolderSelectorContent } from '../BottomSheetFolderSelectorContent'
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
  setIsMultiSelectOn,
  setSelectedRecords,
  onSortPress,
  recordType,
  onCategoryChange
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { expand, collapse } = useBottomSheet()
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
    collapse()
    navigation.navigate('Welcome', { state: 'credentials' })
  }, [collapse, navigation])

  const handleVaultPress = useCallback(() => {
    expand({
      children: (
        <BottomSheetVaultSelectorContent onCreateVault={handleCreateVault} />
      )
    })
  }, [expand, handleCreateVault])

  const handleCategoryPress = useCallback(() => {
    expand({
      children: (
        <BottomSheetCategorySelectorContent
          recordType={recordType}
          onSelect={onCategoryChange}
        />
      )
    })
  }, [expand, recordType, onCategoryChange])

  const handleFolderPress = useCallback(() => {
    expand({
      children: <BottomSheetFolderSelectorContent />
    })
  }, [expand])

  const handleToggleMultiSelect = useCallback(() => {
    collapse()
    setIsMultiSelectOn((prev) => !prev)
    setSelectedRecords([])
  }, [collapse, setIsMultiSelectOn, setSelectedRecords])

  const renderBreadcrumbPill = (icon, label, onPress) => (
    <Pressable
      onPress={onPress}
      style={styles.breadcrumbPill}
      accessibilityLabel={label}
    >
      {icon}
      <Text variant="labelEmphasized" style={styles.breadcrumbPillLabel}>
        {label}
      </Text>
      <ExpandMore
        width={16}
        height={16}
        color={theme.colors.colorTextPrimary}
      />
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.breadcrumbScroll}
          style={styles.breadcrumbScrollContainer}
        >
          {isMultiSelectOn ? (
            <>
              <Text variant="labelEmphasized">{t`All Items`}</Text>
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              <Text variant="labelEmphasized">{folderLabel}</Text>
            </>
          ) : (
            <>
              {renderBreadcrumbPill(
                <LockFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />,
                vaultName,
                handleVaultPress
              )}
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              {renderBreadcrumbPill(
                <Layers
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />,
                menuItems.find((i) => i.type === recordType)?.name ??
                  t`All Items`,
                handleCategoryPress
              )}
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              {renderBreadcrumbPill(
                <FolderCopy
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />,
                folderLabel,
                handleFolderPress
              )}
            </>
          )}
        </ScrollView>
        <BreadcrumbFade side="left" bgColor={bgColor} />
        <BreadcrumbFade side="right" bgColor={bgColor} />
      </View>

      <View style={styles.actionsArea}>
        <Button
          variant="tertiary"
          iconBefore={<Checklist color={theme.colors.colorTextPrimary} />}
          onClick={handleToggleMultiSelect}
          style={styles.actionButton}
          aria-label={t`Toggle multi-select`}
        />
        <Button
          variant="tertiary"
          iconBefore={<FilterList color={theme.colors.colorTextPrimary} />}
          onClick={onSortPress}
          style={styles.actionButton}
          aria-label={t`Sort items`}
        />
      </View>
    </View>
  )
}
