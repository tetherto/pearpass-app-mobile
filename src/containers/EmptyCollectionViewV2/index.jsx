import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  Text,
  Title,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, ImportOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { ScrollView, View } from 'react-native'

import { createStyles } from './styles'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { ItemCardIllustration } from '../../svgs/ItemCardIllustration'
import { BottomSheetCategorySelectorContent } from '../BottomSheetCategorySelectorContent'

export const EmptyCollectionViewV2 = ({ recordType = 'all' }) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const styles = createStyles()
  const menuItems = useRecordMenuItems({ exclude: ['password'] })
  const { state } = useSharedFilter()

  const isAllItems = recordType === 'all'
  const isFavorites = !!state?.isFavorite
  const categoryLabel = menuItems.find((item) => item.type === recordType)?.name
  const selectedFolder =
    state?.folder && state.folder !== 'allFolder' && state.folder !== 'favorite'
      ? state.folder
      : undefined

  const { title, description } = useMemo(() => {
    if (isFavorites) {
      return {
        title: t`No favorite items`,
        description: t`Mark items as favorites`
      }
    }

    if (selectedFolder) {
      return {
        title: t`Empty folder`,
        description: t`Start adding items or save existing ones in the ${selectedFolder} folder`
      }
    }

    if (!isAllItems) {
      return {
        title: t`No item of type ${categoryLabel}`,
        description: t`Start adding items of type ${categoryLabel} in your vault`
      }
    }

    return {
      title: t`No item saved`,
      description: t`Start using PearPass creating your first item or import your items from a different password manager`
    }
  }, [isFavorites, isAllItems, categoryLabel, selectedFolder, t])

  const handleCreateRecord = (type) => {
    if (type === 'password') {
      navigation.navigate('CreatePasswordItem')
      return
    }

    if (type === 'authenticator') {
      navigation.navigate('CreateRecord', { recordType: 'login' })
      return
    }

    navigation.navigate('CreateRecord', { recordType: type })
  }

  const addItemButton = (
    <Button
      variant="primary"
      fullWidth
      iconBefore={<Add />}
      onClick={isAllItems ? undefined : () => handleCreateRecord(recordType)}
    >
      {t`Add item`}
    </Button>
  )

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ItemCardIllustration />
      <View style={styles.title}>
        <Title style={styles.textCenter}>{title}</Title>
      </View>
      <View style={styles.description}>
        <Text
          variant="label"
          color={theme.colors.colorTextSecondary}
          style={styles.textCenter}
        >
          {description}
        </Text>
      </View>
      {!isFavorites && (
        <View style={styles.buttonsContainer}>
          {isAllItems ? (
            <ContextMenu trigger={addItemButton}>
              <BottomSheetCategorySelectorContent
                variant="add-item"
                onSelect={handleCreateRecord}
              />
            </ContextMenu>
          ) : (
            addItemButton
          )}
          <Button
            variant="secondary"
            fullWidth
            iconBefore={
              <ImportOutlined color={theme.colors.colorTextPrimary} />
            }
            onClick={() => navigation.navigate('ImportItems')}
          >
            {t`Import items`}
          </Button>
        </View>
      )}
    </ScrollView>
  )
}
