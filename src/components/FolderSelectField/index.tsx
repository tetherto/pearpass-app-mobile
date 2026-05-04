import { useState } from 'react'

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
import { Keyboard } from 'react-native'

import { BottomSheetFolderSelectorContent } from '../../containers/BottomSheetFolderSelectorContent'

const KEYBOARD_DISMISS_DELAY_MS = 250

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
  const [open, setOpen] = useState(false)

  const handleOpenChange = (next: boolean) => {
    if (next) {
      Keyboard.dismiss()
      setTimeout(() => setOpen(true), KEYBOARD_DISMISS_DELAY_MS)
      return
    }
    setOpen(false)
  }

  const handleSelect = (folder?: { name?: string }) => {
    if (!folder) return
    onChange(folder.name === value ? '' : (folder.name ?? ''))
  }

  const hasValue = Boolean(value)

  return (
    <MultiSlotInput testID={multiSlotTestID}>
      <ContextMenu
        open={open}
        onOpenChange={handleOpenChange}
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
