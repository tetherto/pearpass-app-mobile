import { useLingui } from '@lingui/react/macro'
import { CommonFileIcon } from 'pearpass-lib-ui-react-native-components'

import { InputField } from '../../libComponents'

// UI displays this as "Comment"
export const InputFieldNote = (props) => {
  const { t } = useLingui()
  return (
    <InputField
      label={t`Comment`}
      placeholder={t`Add comment`}
      variant="outline"
      icon={CommonFileIcon}
      {...props}
    />
  )
}
