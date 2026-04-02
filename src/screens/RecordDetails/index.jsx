import { RecordDetailsV1 } from './v1/RecordDetailsV1'
import { RecordDetailsV2 } from './v2/RecordDetailsV2'
import { APP_VERSION } from '../CreateRecord'

export const RecordDetails = (props) => {
  if (APP_VERSION === 1) return <RecordDetailsV1 {...props} />
  return <RecordDetailsV2 {...props} />
}
