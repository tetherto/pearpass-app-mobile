import { DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'

import { CreateRecordV1 } from './v1/CreateRecordV1'
import { CreateRecordV2 } from './v2/CreateRecordV2'

export const CreateRecord = (props) => {
  if (DESIGN_VERSION === 1) return <CreateRecordV1 {...props} />
  return <CreateRecordV2 {...props} />
}
