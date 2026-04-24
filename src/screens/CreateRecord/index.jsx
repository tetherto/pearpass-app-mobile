import { isV2 } from 'src/utils/designVersion'

import { CreateRecordV1 } from './v1/CreateRecordV1'
import { CreateRecordV2 } from './v2/CreateRecordV2'

export const CreateRecord = (props) =>
  isV2() ? <CreateRecordV2 {...props} /> : <CreateRecordV1 {...props} />
