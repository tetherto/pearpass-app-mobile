import { CreateRecordV1 } from './v1/CreateRecordV1'
import { CreateRecordV2 } from './v2/CreateRecordV2'
// import { DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'

// todo: temp for dev purpose ,easy to change.
export const APP_VERSION = 2

export const CreateRecord = (props) => {
  if (APP_VERSION === 1) return <CreateRecordV1 {...props} />
  return <CreateRecordV2 {...props} />
}
