import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  MultiSlotInput,
  SelectField,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Close,
  KeyboardArrowBottom
} from '@tetherto/pearpass-lib-ui-kit/icons'

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
    onChange(folder.name === value ? '' : (folder.name ?? ''))
  }

  const hasValue = Boolean(value)

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
              <>
                {hasValue && (
                  <Button
                    size="small"
                    variant="tertiary"
                    aria-label={t`Clear folder`}
                    iconBefore={
                      <Close color={theme.colors.colorTextPrimary} />
                    }
                    onClick={() => onChange('')}
                  />
                )}
                <KeyboardArrowBottom color={theme.colors.colorTextPrimary} />
              </>
            }
          />
        }
      >
        <BottomSheetFolderSelectorContent
          selectedFolder={value}
          onSelect={handleSelect}
          includeFavorites={false}
          includeAllFolders={false}
        />
      </ContextMenu>
    </MultiSlotInput>
  )
}
