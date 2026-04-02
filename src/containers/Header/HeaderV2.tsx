import { useLingui } from '@lingui/react/macro'
import { useTheme, rawTokens, Button, SearchField } from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  ImportOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View, StyleSheet } from 'react-native'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { BottomSheetRecordCreateContent } from '../BottomSheetRecordCreateContent'
import { ScreenHeader } from '../ScreenHeader'

export const HeaderV2 = ({ setSearchValue, searchValue }) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { expand } = useBottomSheet()

  const handleAdd = () => {
    expand({
      children: <BottomSheetRecordCreateContent />,
      snapPoints: ['1%', '80%']
    })
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
            iconBefore={<ImportOutlined color={theme.colors.colorTextPrimary} />}
          />

          <Button
            variant="primary"
            size="medium"
            aria-label="Add item"
            iconBefore={<Add />}
            onClick={handleAdd}
          />
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
