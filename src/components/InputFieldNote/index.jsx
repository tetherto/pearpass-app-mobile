import { useLingui } from '@lingui/react/macro'
import { InsertDriveFileOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'

import { InputField } from '../../libComponents'

// UI displays this as "Comment"
export const InputFieldNote = (props) => {
  const { t } = useLingui()
  return (
    <InputField
      label={t`Comment`}
      placeholder={t`Add comment`}
      variant="outline"
      icon={InsertDriveFileOutlined}
      {...props}
    />
  )
}
