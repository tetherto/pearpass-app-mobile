import { isV2 } from 'src/utils/designVersion'

import { RecordDetailsV1 } from './v1/RecordDetailsV1'
import { RecordDetailsV2 } from './v2/RecordDetailsV2'

export const RecordDetails = (props) =>
  isV2() ? <RecordDetailsV2 {...props} /> : <RecordDetailsV1 {...props} />
