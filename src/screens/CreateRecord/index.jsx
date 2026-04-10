import { CreateRecordV1 } from './v1/CreateRecordV1'
import { CreateRecordV2 } from './v2/CreateRecordV2'

const APP_VERSION = 2

export const CreateRecord = (props) => {
  // return <CreateRecordV1 {...props} />
  if (APP_VERSION === 1) return <CreateRecordV1 {...props} />
  return <CreateRecordV2 {...props} />
}
