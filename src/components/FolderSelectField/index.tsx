import { useLingui } from '@lingui/react/macro'
import {
  ContextMenu,
  MultiSlotInput,
  SelectField,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowBottom } from '@tetherto/pearpass-lib-ui-kit/icons'

import { BottomSheetFolderSelectorContent } from '../../containers/BottomSheetFolderSelectorContent'

type Props = {
  value?: string
  onChange: (folderName: string) => void
  testID?: string
  multiSlotTestID?: string
}

export const FolderSelectField = ({
  value,
  onChange,
  testID = 'folder-field',
  multiSlotTestID = 'folder-multi-slot-input'
}: Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const handleSelect = (folder?: { name?: string }) => {
    if (!folder) return
    if (folder.name === 'allFolder') {
      onChange('')
      return
    }
    onChange(folder.name === value ? '' : (folder.name ?? ''))
  }

  return (
    <MultiSlotInput testID={multiSlotTestID}>
      <ContextMenu
        trigger={
          <SelectField
            label={t`Folder`}
            value={value ?? ''}
            placeholder={t`Choose Folder`}
            isGrouped
            testID={testID}
            rightSlot={
              <KeyboardArrowBottom color={theme.colors.colorTextPrimary} />
            }
          />
        }
      >
        <BottomSheetFolderSelectorContent
          selectedFolder={value}
          onSelect={handleSelect}
        />
      </ContextMenu>
    </MultiSlotInput>
  )
}
