import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  ArrowBackOutined,
  DriveFileMoveOutlined,
  StarOutlined,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useRecords } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'

import { createStyles } from './styles'

export const MultiSelectBar = ({
  selectedRecords,
  setSelectedRecords,
  setIsMultiSelectOn,
  records
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { updateFavoriteState } = useRecords()
  const styles = createStyles(theme.colors)

  const selectedCount = selectedRecords.length

  const selectedRecordsSet = useMemo(
    () => new Set(selectedRecords),
    [selectedRecords]
  )
  const selectedRecordObjects = useMemo(
    () => records.filter((r) => selectedRecordsSet.has(r.id)),
    [records, selectedRecordsSet]
  )
  const allFavorited = useMemo(
    () =>
      selectedRecordObjects.length > 0 &&
      selectedRecordObjects.every((r) => r.isFavorite),
    [selectedRecordObjects]
  )

  const handleExitMultiSelect = () => {
    setSelectedRecords([])
    setIsMultiSelectOn(false)
  }

  const handleMovePress = () => {
    navigation.navigate('MultiSelectMove', {
      selectedRecordIds: selectedRecords,
      selectedRecordObjects,
      onComplete: () => {
        setSelectedRecords([])
        setIsMultiSelectOn(false)
      }
    })
  }

  const handleFavoritePress = () => {
    if (!selectedCount) return
    updateFavoriteState(selectedRecords, !allFavorited)
    setSelectedRecords([])
  }

  const handleDeletePress = () => {
    navigation.navigate('MultiSelectDelete', {
      selectedRecordIds: selectedRecords,
      selectedRecordObjects,
      onComplete: () => {
        setSelectedRecords([])
        setIsMultiSelectOn(false)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.backSection}>
        <Button
          variant="tertiary"
          iconBefore={
            <ArrowBackOutined color={theme.colors.colorTextPrimary} />
          }
          onClick={handleExitMultiSelect}
          aria-label={t`Exit multi-select`}
        />
      </View>
      <View style={styles.leftSection}>
        <View style={{ flex: 1 }}>
          <Text variant="labelEmphasized">
            {selectedCount} {t`Items selected`}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            variant="tertiary"
            iconBefore={
              <DriveFileMoveOutlined color={theme.colors.colorTextPrimary} />
            }
            onClick={handleMovePress}
            disabled={!selectedCount}
            aria-label={t`Move items`}
          />

          <Button
            variant="tertiary"
            iconBefore={<StarOutlined color={theme.colors.colorTextPrimary} />}
            onClick={handleFavoritePress}
            disabled={!selectedCount}
            aria-label={t`Favorite items`}
          />
        </View>
      </View>

      <View style={styles.deleteSection}>
        <Button
          variant="destructive"
          iconBefore={<TrashOutlined />}
          onClick={handleDeletePress}
          disabled={!selectedCount}
          aria-label={t`Delete items`}
        />
      </View>
    </View>
  )
}
