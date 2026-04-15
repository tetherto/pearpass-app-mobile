import { useLingui } from '@lingui/react/macro'
import {
  ArrowDownIcon,
  FolderIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'

import { FolderSelectorWrapper, FolderTitle } from './styles'

export const FolderDropDown = ({ onPress, selectedFolder }) => {
  const { t } = useLingui()

  return (
    <FolderSelectorWrapper onPress={onPress}>
      <FolderIcon size={21} />
      <FolderTitle>
        {selectedFolder ? selectedFolder : t`No Folder`}
      </FolderTitle>

      <ArrowDownIcon size={12} />
    </FolderSelectorWrapper>
  )
}
