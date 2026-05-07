import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import { Add, SyncLock, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  Button,
  InputField,
  MultiSlotInput,
  PasswordField,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Keyboard, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { FormGroup } from '../../../components/FormGroup'

import { FolderSelectField } from '../../../components/FolderSelectField'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { Layout } from '../../../containers/Layout'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { addHttps } from '../../../utils/addHttps'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'
import { logger } from '../../../utils/logger'
import { getPasswordIndicatorVariant } from '../../../utils/passwordPolicy'
import { AttachmentFieldsV2 } from '../../../components/AttachmentFieldsV2'
import { OtpSecretScanButton } from './OtpSecretScanButton'

type LoginAttachment = {
  base64?: string
  id?: string | number
  name: string
}

type UploadedLoginAttachment = LoginAttachment & {
  base64: string
}

type WebsiteFormValue = {
  website?: string
}

type HiddenMessageField = {
  type: string
  note: string
}

type LoginRecord = {
  data?: {
    title?: string
    username?: string
    password?: string
    otpInput?: string
    otp?: { secret?: string }
    note?: string
    websites?: string[]
    customFields?: HiddenMessageField[]
    credential?: { id?: string }
    passkeyCreatedAt?: string
    passwordUpdatedAt?: string
  }
  folder?: string
  isFavorite?: boolean
  attachments?: LoginAttachment[]
}

interface Props {
  initialRecord?: LoginRecord
  selectedFolder?: string
}

type CreatePasswordItemNavigation = {
  navigate: (
    screen: 'CreatePasswordItem',
    params: { onPasswordInsert: (value: string) => void }
  ) => void
  goBack: () => void
}

type FormValues = {
  title: string
  username: string
  password: string
  otpSecret: string
  note: string
  websites: WebsiteFormValue[]
  customFields: HiddenMessageField[]
  folder?: string
  attachments: LoginAttachment[]
  credential: string
  passkeyCreatedAt: string | null
}

const isUploadedLoginAttachment = (
  attachment: LoginAttachment
): attachment is UploadedLoginAttachment => typeof attachment.base64 === 'string'

export function adaptRegister(reg: {
  value: string
  name: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void
}) {
  return {
    value: reg.value,
    error: reg.error,
    name: reg.name,
    onChangeText: (value: string) => reg.onChange(value ?? ''),
  }
}

export const CreateOrEditLoginContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation<CreatePasswordItemNavigation>()
  const { setIsLoading, isLoading } = useLoadingContext()
  const { theme } = useTheme()
  const isEditing = !!initialRecord
  const actionLabel = isEditing ? t`Save Changes` : t`Add Item`

  const { createRecord } = useCreateRecord({
    onCompleted: () => navigation.goBack()
  })

  const { updateRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`),
    username: Validator.string(),
    password: Validator.string(),
    otpSecret: Validator.string(),
    note: Validator.string(),
    websites: Validator.array().items(
      Validator.object({
        website: Validator.string().website('Wrong format of website')
      })
    ),
    customFields: Validator.array().items(
      Validator.object({
        note: Validator.string()
      })
    ),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { register, handleSubmit, registerArray, values, setValue, errors } =
    useForm<FormValues>({
      initialValues: {
        title: initialRecord?.data?.title ?? '',
        username: initialRecord?.data?.username ?? '',
        password: initialRecord?.data?.password ?? '',
        otpSecret:
          initialRecord?.data?.otpInput ??
          initialRecord?.data?.otp?.secret ??
          '',
        note: initialRecord?.data?.note ?? '',
        websites: initialRecord?.data?.websites?.length
          ? initialRecord.data.websites.map((website) => ({ website }))
          : [{ website: '' }],
        customFields: initialRecord?.data?.customFields ?? [],
        folder: selectedFolder ?? initialRecord?.folder,
        attachments: initialRecord?.attachments ?? [],
        credential: initialRecord?.data?.credential?.id ?? '',
        passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
      },
      validate: (formValues) => schema.validate(formValues)
    })

  useGetMultipleFiles({
    fieldNames: ['attachments'],
    updateValues: setValue,
    initialRecord
  })

  const onError = (error: Error) => {
    Toast.show({
      type: 'baseToast',
      text1: error.message,
      position: 'bottom',
      bottomOffset: 100
    })
  }

  const onSubmit = async (values: FormValues) => {
    if (isLoading) return

    const otpInput = values.otpSecret?.trim() || undefined

    const data = {
      type: RECORD_TYPES.LOGIN,
      folder: values.folder,
      isFavorite: initialRecord?.isFavorite,
      data: {
        ...(initialRecord?.data ? initialRecord.data : {}),
        title: values.title,
        username: values.username,
        password: values.password,
        note: values.note,
        otpInput,
        websites: values.websites
          .map((item) => {
            const website = item.website?.trim()

            if (website?.length) {
              return addHttps(website)
            }
          })
          .filter((website): website is string => !!website?.trim().length),
        customFields: (
          (values.customFields as Array<{ type: string; note?: string }>) ??
          []
        ).filter((f) => f.note?.trim().length), 
        attachments: convertBase64FilesToUint8(
          values.attachments.filter(isUploadedLoginAttachment)
        ),
        passwordUpdatedAt: initialRecord?.data?.passwordUpdatedAt
      }
    }

    try {
      setIsLoading(true)

      if (initialRecord) {
        await updateRecords(
          [{ ...initialRecord, ...data }],
          onError
        )
      } else {
        await createRecord(data, onError)
      }

      setIsLoading(false)
    } catch (error: unknown) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const {
    value: websitesList,
    addItem,
    removeItem
  } = registerArray('websites')

  const {
    addItem: addCustomField,
    removeItem: removeCustomField
  } = registerArray('customFields')

  const handleFirstHiddenMessageChange = (value: string) => {
    setValue('customFields', value ? [{ type: 'note', note: value }] : [])
  }

  const openPasswordGenerator = () => {
    Keyboard.dismiss()
    navigation.navigate('CreatePasswordItem', {
      onPasswordInsert: (value: string) => setValue('password', value)
    })
  }

  const handleFileUpload = (file?: LoginAttachment | null) => {
    if (!file) {
      return
    }

    setValue('attachments', [...values.attachments, file])
  }

  const handleAttachmentReplace = (
    index: number,
    file?: LoginAttachment | null
  ) => {
    if (!file) {
      return
    }

    const updatedAttachments = values.attachments.map((attachment, idx) =>
      idx === index ? file : attachment
    )

    setValue('attachments', updatedAttachments)
  }

  const handleAttachmentDelete = (index: number) => {
    const updatedAttachments = values.attachments.filter(
      (_, idx) => idx !== index
    )
    setValue('attachments', updatedAttachments)
  }

  return (
    <Layout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={isEditing ? t`Edit Login Item` : t`New Login Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !values.title.trim()}
          onClick={handleSubmit(onSubmit)}
        >
          {actionLabel}
        </Button>
      }
    >
      <View>
        <InputField
          label={t`Title`}
          placeholder={t`Enter Title`}
          testID="title-field"
          {...adaptRegister(register('title'))}
        />
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Credentials`}
        </Text>

        <MultiSlotInput
          actions={
            <Button
              variant="tertiaryAccent"
              iconBefore={<SyncLock />}
              onClick={openPasswordGenerator}
            >
              {t`Generate Password`}
            </Button>
          }
          testID="credentials-multi-slot-input"
        >
          <InputField
            label={t`Email / Username`}
            value={values.username}
            placeholder={t`Enter Email / Username`}
            onChangeText={(val) => setValue('username', val)}
            testID="credentials-multi-slot-input-slot-0"
          />
          <PasswordField
            label={t`Password`}
            value={values.password}
            placeholder={t`Enter Password`}
            onChangeText={(val) => setValue('password', val)}
            passwordIndicator={getPasswordIndicatorVariant(values.password)}
            testID="credentials-multi-slot-input-slot-1"
          />
        </MultiSlotInput>

        {AUTHENTICATOR_ENABLED && (
          <FormGroup>
            <PasswordField
              label={t`Authenticator Secret Key`}
              placeholder={t`Enter Secret Key (TOTP)`}
              rightSlot={
                <OtpSecretScanButton onScanned={(secret) => setValue('otpSecret', secret)} />
              }
              testID="otp-secret-field"
              {...adaptRegister(register('otpSecret'))}
            />
          </FormGroup>
        )}

        {!!values?.credential && (
          <FormGroup>
            <InputField
              label={t`Passkey`}
              placeholder={t`Passkey`}
              readOnly
              value={
                formatPasskeyDate(values.passkeyCreatedAt) ||
                t`Passkey Stored`
              }
              onChange={() => { }}
            />
          </FormGroup>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Details`}
        </Text>

        <MultiSlotInput
          actions={
            <Button
              variant="tertiaryAccent"
              iconBefore={<Add />}
              onClick={() => addItem({ website: '' })}
            >
              {t`Add Another Website`}
            </Button>
          }
          errorMessage={(errors as Record<string, { error?: { website?: string } }[]>)?.websites?.find(Boolean)?.error?.website}
          testID="website-multi-slot-input"
        >
          {websitesList.map((w, index) => (
            <InputField
              key={index}
              label={t`Website`}
              value={w?.website ?? ''}
              placeholder={t`Enter Website`}
              onChangeText={(val) => setValue(`websites[${index}].website`, val)}
              isGrouped
              testID={`website-multi-slot-input-slot-${index}`}
              rightSlot={
                websitesList.length > 1 ? (
                  <Button
                    size="small"
                    variant="tertiary"
                    aria-label="Delete website"
                    iconBefore={<TrashOutlined color={theme.colors.colorTextPrimary} />}
                    onClick={() => removeItem(index)}
                  />
                ) : undefined
              }
            />
          ))}
        </MultiSlotInput>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Additional`}
        </Text>

        <FolderSelectField
          value={values.folder}
          onChange={(val) => setValue('folder', val)}
        />

        <InputField
          label={t`Comment`}
          value={values.note}
          placeholder={t`Enter Comment`}
          onChangeText={(val) => setValue('note', val)}
          testID="comments-multi-slot-input-slot-0"
        />

        <AttachmentFieldsV2
          attachments={values.attachments}
          isEditing={isEditing}
          onAdd={handleFileUpload}
          onReplace={handleAttachmentReplace}
          onDelete={handleAttachmentDelete}
        />

        <MultiSlotInput
          actions={
            <Button
              size='small'
              variant="tertiaryAccent"
              iconBefore={<Add />}
              onClick={() => addCustomField({ type: 'note', note: '' })}
            >
              {t`Add Another Message`}
            </Button>
          }
          errorMessage={(errors as Record<string, { error?: { note?: string } }[]>)?.customFields?.find(Boolean)?.error?.note}
          testID="hidden-messages-multi-slot-input"
        >
          {values.customFields.length
            ? values.customFields.map((field, index) => (
              <PasswordField
                key={index}
                label={t`Hidden Message`}
                value={field.note ?? ''}
                placeholder={t`Enter Hidden Message`}
                onChangeText={(val) => setValue(`customFields[${index}].note`, val)}
                isGrouped
                testID={`hidden-messages-multi-slot-input-slot-${index}`}
                rightSlot={
                  values.customFields.length > 1 ? (
                    <Button
                      size='small'
                      variant="tertiary"
                      aria-label="Delete hidden message"
                      iconBefore={<TrashOutlined color={theme.colors.colorTextPrimary} />}
                      onClick={() => removeCustomField(index)}
                    />
                  ) : undefined
                }
              />
            ))
            : (
              <PasswordField
                label={t`Hidden Message`}
                value=""
                placeholder={t`Enter Hidden Message`}
                onChangeText={handleFirstHiddenMessageChange}
                isGrouped
                testID="hidden-messages-multi-slot-input-slot-0"
              />
            )}
        </MultiSlotInput>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing24,
    paddingBottom: rawTokens.spacing24
  },
  section: {
    gap: rawTokens.spacing12
  },
  groupedField: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing8,
    overflow: 'hidden'
  },
  groupedAction: {
    borderTopWidth: 1,
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing8
  }
})
