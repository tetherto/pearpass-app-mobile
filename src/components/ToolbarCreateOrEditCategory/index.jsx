import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  SaveIcon,
  XIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { ActivityIndicator, Keyboard, View } from 'react-native'

import { BottomSheetFolderListContent } from '../../containers/BottomSheetFolderListContent'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { FolderDropDown } from '../FolderDropDown'
import { RecordFormHeader, RecordFormHeaderActions } from './styles'
import { ButtonLittle } from '../../libComponents'

/**
 * @param {Object} props
 * @param {Function} props.onSave
 * @param {Function} props.onFolderSelect
 * @param {Object} props.selectedFolder
 * @param {boolean} props.isLoading
 */
export const ToolbarCreateOrEditCategory = ({
  onSave,
  onFolderSelect,
  selectedFolder,
  isLoading
}) => {
  const { expand } = useBottomSheet()
  const navigation = useNavigation()
  const { t } = useLingui()

  return (
    <RecordFormHeader>
      <View>
        <ButtonLittle
          activeOpacity={0.5}
          startIcon={XIcon}
          variant="secondary"
          borderRadius="md"
          testId="button-little"
          onPress={() => navigation.goBack()}
        />
      </View>

      <RecordFormHeaderActions>
        <FolderDropDown
          selectedFolder={selectedFolder}
          onPress={() => {
            Keyboard.dismiss()
            setTimeout(() => {
              expand({
                children: (
                  <BottomSheetFolderListContent
                    selectedFolder={selectedFolder}
                    onFolderSelect={onFolderSelect}
                  />
                ),
                snapPoints: ['10%', '20%', '45%']
              })
            }, 500)
          }}
        />

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary400.mode1} />
        ) : (
          <ButtonLittle
            activeOpacity={0.5}
            startIcon={SaveIcon}
            testId="button-little-save"
            onPress={() => {
              onSave()
            }}
          >
            {t`Save`}
          </ButtonLittle>
        )}
      </RecordFormHeaderActions>
    </RecordFormHeader>
  )
}
