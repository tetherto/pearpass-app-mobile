import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
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
  records
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { updateFavoriteState } = useRecords()
  const styles = createStyles(theme.colors)

  const selectedCount = selectedRecords.length

  const getSelectedRecordObjects = () =>
    records.filter((r) => selectedRecords.includes(r.id))

  const handleMovePress = () => {
    navigation.navigate('MultiSelectMove', {
      selectedRecordIds: selectedRecords,
      selectedRecordObjects: getSelectedRecordObjects()
    })
  }

  const handleFavoritePress = () => {
    if (!selectedCount) return
    updateFavoriteState(selectedRecords, true)
    setSelectedRecords([])
  }

  const handleDeletePress = () => {
    navigation.navigate('MultiSelectDelete', {
      selectedRecordIds: selectedRecords,
      selectedRecordObjects: getSelectedRecordObjects()
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text variant="labelEmphasized" style={{ flex: 1 }}>
          {selectedCount} {t`Items selected`}
        </Text>

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
