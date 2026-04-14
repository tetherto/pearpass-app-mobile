import { DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'

import { RecordDetailsV1 } from './v1/RecordDetailsV1'
import { RecordDetailsV2 } from './v2/RecordDetailsV2'

export const RecordDetails = (props) => {
  if (DESIGN_VERSION === 1) return <RecordDetailsV1 {...props} />
  return <RecordDetailsV2 {...props} />
}
