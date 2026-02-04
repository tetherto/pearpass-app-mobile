import { useEffect, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { PasswordIcon } from 'pearpass-lib-ui-react-native-components'

import { CustomFields } from '../../../components/CustomFields'
import { FormGroup } from '../../../components/FormGroup'
import { InputFieldNote } from '../../../components/InputFieldNote'
import { WifiPasswordQRCode } from '../../../components/WifiPasswordQRCode'
import { PasswordField } from '../../../libComponents'

/**
 *
 * @param {Object} [initialRecord] - Existing record data for display
 * @param {Object} [initialRecord.data] - Record data containing title, password, note, customFields
 * @param {string} [initialRecord.data.title] - Wi-Fi network name
 * @param {string} [initialRecord.data.password] - Wi-Fi password
 * @param {string} [initialRecord.data.note] - Additional notes
 * @param {Array} [initialRecord.data.customFields] - Custom field objects
 * @param {string} [initialRecord.folder] - Folder name where record is stored
 * @param {Object} [selectedFolder] - Pre-selected folder
 * @param {string} [selectedFolder.name] - Name of the selected folder
 * @returns {JSX.Element}
 */
export const WifiPasswordDetailsForm = ({ initialRecord, selectedFolder }) => {
  const { t } = useLingui()

  const initialValues = useMemo(
    () => ({
      title: initialRecord?.data?.title ?? '',
      password: initialRecord?.data?.password ?? '',
      note: initialRecord?.data?.note ?? '',
      customFields: initialRecord?.data.customFields ?? [],
      folder: selectedFolder ?? initialRecord?.folder
    }),
    [initialRecord, selectedFolder]
  )

  const { register, registerArray, setValues, values } = useForm({
    initialValues: initialValues
  })

  const { value: customFieldsList, registerItem: registerCustomFieldItem } =
    registerArray('customFields')

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  const hasPassword = !!values?.password?.length
  const hasNote = !!values?.note?.length
  const hasCustomFields = !!customFieldsList?.length

  return (
    <>
      {hasPassword && (
        <FormGroup>
          <PasswordField
            icon={PasswordIcon}
            label={t`Wi-Fi Password`}
            placeholder={t`Insert Wi-Fi Password`}
            variant="outline"
            isDisabled
            belowInputContent={
              <WifiPasswordQRCode
                ssid={values.title}
                password={values.password}
              />
            }
            {...register('password')}
          />
        </FormGroup>
      )}

      {hasNote && (
        <FormGroup>
          <InputFieldNote isDisabled {...register('note')} />
        </FormGroup>
      )}

      {hasCustomFields && (
        <CustomFields
          areInputsDisabled
          customFields={customFieldsList}
          register={registerCustomFieldItem}
        />
      )}
    </>
  )
}
