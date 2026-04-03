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
import { ScrollView, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { BottomSheetCategorySelectorContent } from '../BottomSheetCategorySelectorContent'
import { BottomSheetFolderSelectorContent } from '../BottomSheetFolderSelectorContent'
import { BottomSheetVaultSelectorContent } from '../BottomSheetVaultSelectorContent'

const BREADCRUMB_HEIGHT = 57

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

  const bgColor = theme.colors.colorSurfacePrimary
  const vaultName = vaultData?.name || t`Personal Vault`
  const folderLabel =
    state?.folder &&
    state?.folder !== 'allFolder' &&
    state?.folder !== 'favorite'
      ? state.folder
      : t`All Folders`

  const handleCreateVault = () => {
    collapse()
    navigation.navigate('Welcome', { state: 'credentials' })
  }

  const handleVaultPress = () => {
    expand({
      children: (
        <BottomSheetVaultSelectorContent onCreateVault={handleCreateVault} />
      )
    })
  }

  const handleCategoryPress = () => {
    expand({
      children: (
        <BottomSheetCategorySelectorContent
          recordType={recordType}
          onSelect={onCategoryChange}
        />
      )
    })
  }

  const handleFolderPress = () => {
    expand({
      children: <BottomSheetFolderSelectorContent />
    })
  }

  const handleToggleMultiSelect = () => {
    if (isMultiSelectOn) {
      setIsMultiSelectOn(false)
      setSelectedRecords([])
    } else {
      setIsMultiSelectOn(true)
    }
  }

  const renderBreadcrumbPill = (icon, label, onPress) => (
    <Button
      variant="secondary"
      iconBefore={icon}
      iconAfter={<ExpandMore />}
      onClick={onPress}
      style={styles.breadcrumbPill}
      aria-label={label}
    >
      {label}
    </Button>
  )

  const renderFade = (side) => (
    <View
      pointerEvents="none"
      style={styles[side === 'left' ? 'fadeLeft' : 'fadeRight']}
    >
      <Svg width={24} height={BREADCRUMB_HEIGHT}>
        <Defs>
          <LinearGradient
            id={`fade-${side}`}
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
          height={BREADCRUMB_HEIGHT}
          fill={`url(#fade-${side})`}
        />
      </Svg>
    </View>
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
                  width={14}
                  height={14}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              <Text variant="labelEmphasized">{folderLabel}</Text>
            </>
          ) : (
            <>
              {renderBreadcrumbPill(
                <LockFilled />,
                vaultName,
                handleVaultPress
              )}
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={14}
                  height={14}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              {renderBreadcrumbPill(
                <Layers />,
                t`All Items`,
                handleCategoryPress
              )}
              <View style={styles.chevronSeparator}>
                <KeyboardArrowRightFilled
                  width={14}
                  height={14}
                  color={theme.colors.colorTextPrimary}
                />
              </View>
              {renderBreadcrumbPill(
                <FolderCopy />,
                folderLabel,
                handleFolderPress
              )}
            </>
          )}
        </ScrollView>
        {renderFade('left')}
        {renderFade('right')}
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
