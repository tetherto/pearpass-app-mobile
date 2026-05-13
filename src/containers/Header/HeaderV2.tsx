import { useLingui } from '@lingui/react/macro'
import {
  useNavigation,
  type NavigationProp,
  type ParamListBase
} from '@react-navigation/native'
import {
  useTheme,
  rawTokens,
  Button,
  ContextMenu,
  SearchField
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, ImportOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { View, StyleSheet } from 'react-native'

import { BottomSheetCategorySelectorContent } from '../BottomSheetCategorySelectorContent'
import { ScreenHeader } from '../ScreenHeader'

interface HeaderV2Props {
  setSearchValue: (value: string) => void
  searchValue: string
  recordType?: string
}

export const HeaderV2 = ({
  setSearchValue,
  searchValue,
  recordType = 'all'
}: HeaderV2Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const navigation = useNavigation<NavigationProp<ParamListBase>>()

  const handleCreateRecord = (type: string) => {
    if (type === 'password') {
      navigation.navigate('CreatePasswordItem')
      return
    }

    navigation.navigate('CreateRecord', { recordType: type })
  }

  const isAllItems = recordType === 'all'

  const addItemButton = (
    <Button
      variant="primary"
      size="medium"
      aria-label="Add item"
      iconBefore={<Add />}
      onClick={isAllItems ? undefined : () => handleCreateRecord(recordType)}
    />
  )

  return (
    <ScreenHeader
      centerSlot={
        <View style={{ flex: 1 }}>
          <SearchField
            value={searchValue}
            size={'medium'}
            placeholderText={t`Search in All Items`}
            onChangeText={setSearchValue}
          />
        </View>
      }
      rightActions={
        <View style={styles.rightActionsContainer}>
          <Button
            variant="tertiary"
            size="medium"
            aria-label="Import"
            iconBefore={
              <ImportOutlined color={theme.colors.colorTextPrimary} />
            }
            onClick={() => navigation.navigate('ImportVault')}
          />

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
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8
  }
})
