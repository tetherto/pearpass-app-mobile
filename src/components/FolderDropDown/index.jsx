import { useLingui } from '@lingui/react/macro'
import {
  KeyboardArrowBottom,
  Folder
} from '@tetherto/pearpass-lib-ui-kit/icons'

import { FolderSelectorWrapper, FolderTitle } from './styles'

export const FolderDropDown = ({ onPress, selectedFolder }) => {
  const { t } = useLingui()

  return (
    <FolderSelectorWrapper onPress={onPress}>
      <Folder width={21} height={21} />
      <FolderTitle>
        {selectedFolder ? selectedFolder : t`No Folder`}
      </FolderTitle>

      <KeyboardArrowBottom width={12} height={12} />
    </FolderSelectorWrapper>
  )
}
