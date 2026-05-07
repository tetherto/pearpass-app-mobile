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
}

export const HeaderV2 = ({ setSearchValue, searchValue }: HeaderV2Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const navigation = useNavigation<NavigationProp<ParamListBase>>()

  const handleCreateRecord = (recordType: string) => {
    if (recordType === 'password') {
      navigation.navigate('CreatePasswordItem')
      return
    }

    navigation.navigate('CreateRecord', { recordType })
  }

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

          <ContextMenu
            trigger={
              <Button
                variant="primary"
                size="medium"
                aria-label="Add item"
                iconBefore={<Add />}
              />
            }
          >
            <BottomSheetCategorySelectorContent
              variant="add-item"
              onSelect={handleCreateRecord}
            />
          </ContextMenu>
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
