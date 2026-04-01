import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  PasswordIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  RECORD_TYPES,
  useCreateRecord,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import {
  InputField,
  MultiSlotInput,
  UploadField
} from '@tetherto/pearpass-lib-ui-kit'
import type { UploadedFile } from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'

import { ToolbarCreateOrEditCategory } from '../../../components/ToolbarCreateOrEditCategory'
import { BottomSheetPassGeneratorContent } from '../../../containers/BottomSheetPassGeneratorContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'
import { useGetMultipleFiles } from '../../../hooks/useGetMultipleFiles'
import { ButtonLittle } from '../../../libComponents'
import { addHttps } from '../../../utils/addHttps'
import { convertBase64FilesToUint8 } from '../../../utils/convertBase64FilesToUint8'
import { formatPasskeyDate } from '../../../utils/formatPasskeyDate'
import { handleChooseFile } from '../../../utils/handleChooseFile'
import { logger } from '../../../utils/logger'
import {
  FormWrapper,
  Header,
  ScrollContainer,
  ScrollView,
  Wrapper
} from './styles'

interface Props {
  initialRecord?: any
  selectedFolder?: string
}

export function adaptRegister(reg: {
  value: string
  error?: string
  onChange: (val: any) => void
}) {
  return {
    value: reg.value,
    onChangeText: (val: string) => reg.onChange(val),
    variant: reg.error ? ('error' as const) : ('default' as const),
    errorMessage: reg.error ?? undefined
  }
}

export const CreateOrEditLoginContent = ({
  initialRecord,
  selectedFolder
}: Props) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { expand } = useBottomSheet()
  const { setIsLoading, isLoading } = useLoadingContext()

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
      Validator.string().website('Wrong format of website')
    ),
    comments: Validator.array().items(Validator.string()),
    folder: Validator.string(),
    attachments: Validator.array().items(
      Validator.object({
        id: Validator.string(),
        name: Validator.string().required()
      })
    )
  })

  const { register, handleSubmit, values, setValue } = useForm({
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
        ? initialRecord.data.websites
        : [''],
      comments: initialRecord?.data?.customFields
        ?.filter((f: any) => f.type === 'note')
        ?.map((f: any) => f.note ?? '') ?? [''],
      folder: selectedFolder ?? initialRecord?.folder,
      attachments: initialRecord?.attachments ?? [],
      credential: initialRecord?.data?.credential?.id ?? '',
      passkeyCreatedAt: initialRecord?.data?.passkeyCreatedAt ?? null
    },
    validate: (values: any) => schema.validate(values)
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

  const onSubmit = async (values: any) => {
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
        websites: (values.websites as string[])
          .map((website: string) => {
            if (!!website?.trim().length) {
              return addHttps(website)
            }
          })
          .filter(
            (website: string | undefined) => !!website?.trim().length
          ),
        customFields: (values.comments as string[])
          .filter((c: string) => !!c?.trim().length)
          .map((c: string) => ({ type: 'note', note: c })),
        attachments: convertBase64FilesToUint8(values.attachments),
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
    } catch (error: any) {
      logger.error(error)
      setIsLoading(false)
    }
  }

  const handleFilesChange = (files: UploadedFile[]) => {
    setValue('attachments', files)
  }

  const MAX_ATTACHMENTS = 5

  const handleUploadPress = () => {
    const currentFiles = values.attachments as UploadedFile[]
    if (currentFiles.length >= MAX_ATTACHMENTS) return

    handleChooseFile(
      ({ base64, name }: { base64: string; name: string }) => {
        const newFile: UploadedFile = {
          file: null as unknown as File, // not available on native
          name,
          size: Math.round((base64.length * 3) / 4), // approximate byte size from base64
          type: 'application/octet-stream',
          // @ts-ignore — base64 is a native-only extension of UploadedFile used by convertBase64FilesToUint8
          base64
        }
        setValue('attachments', [...currentFiles, newFile])
      },
      () => {
        Toast.show({
          type: 'baseToast',
          text1: t`File is too large`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    )
  }

  return (
    <Wrapper>
      <Header>
        <ToolbarCreateOrEditCategory
          isLoading={isLoading}
          selectedFolder={values.folder}
          onFolderSelect={(folder: any) =>
            setValue(
              'folder',
              folder.name === values.folder ? '' : folder.name
            )
          }
          onSave={handleSubmit(onSubmit)}
        />
      </Header>

      <ScrollContainer>
        <ScrollView>
          <FormWrapper>

            <InputField
              label={t`Title`}
              placeholderText={t`No title`}
              testID="title-field"
              {...adaptRegister(register('title'))}
            />

            <InputField
              label={t`Email or username`}
              placeholderText={t`Email or username`}
              testID="email-username-field"
              {...adaptRegister(register('username'))}
            />

            <InputField
              label={t`Password`}
              placeholderText={t`Insert password`}
              inputType="password"
              testID="password-field"
              rightSlot={
                <ButtonLittle
                  startIcon={PasswordIcon}
                  variant="secondary"
                  borderRadius="md"
                  testID="password-generator-button"
                  accessibilityLabel={t`Password generator button`}
                  onPress={() =>
                    expand({
                      children: (
                        <BottomSheetPassGeneratorContent
                          onPasswordInsert={(value: string) =>
                            setValue('password', value)
                          }
                        />
                      ),
                      snapPoints: ['10%', '75%', '75%']
                    })
                  }
                />
              }
              {...adaptRegister(register('password'))}
            />

            {AUTHENTICATOR_ENABLED && (
              <InputField
                label={t`Authenticator Secret Key`}
                placeholderText={t`Enter Secret Key or otpauth:// URI`}
                inputType="password"
                testID="otp-secret-field"
                {...adaptRegister(register('otpSecret'))}
              />
            )}

            {!!values?.credential && (
              <InputField
                label={t`Passkey`}
                placeholderText={t`Passkey`}
                value={
                  formatPasskeyDate(values.passkeyCreatedAt) ||
                  t`Passkey Stored`
                }
                onChangeText={() => { }}
              />
            )}

            <MultiSlotInput
              label={t`Website`}
              placeholderText="https://"
              addButtonLabel={t`Add another website`}
              values={values.websites as string[]}
              onChange={(updated: string[]) => setValue('websites', updated)}
              testID="website-multi-slot-input"
            />

            <UploadField
              files={values.attachments as UploadedFile[]}
              onFilesChange={handleFilesChange}
              onPress={handleUploadPress}
              uploadLinkText={t`Click to upload`}
              uploadSuffixText={t`or drag and drop`}
              maxFiles={MAX_ATTACHMENTS}
              testID="attachments-upload-field"
            />

            {/* TODO: "notes" field was removed — unclear why it existed alongside the comments field. 
            Confirm during review whether to keep or remove it. */}

            {/* <InputField
              label={t`Comment`}
              placeholderText={t`Add comment`}
              icon={CommonFileIcon}
              testID="add-note-field"
              {...adaptRegister(register('note'))}
            /> */}

            <MultiSlotInput
              label={t`Custom comments`}
              placeholderText={t`Add comment`}
              addButtonLabel={t`Add another comment`}
              values={values.comments as string[]}
              onChange={(updated: string[]) => setValue('comments', updated)}
              testID="custom-comments-multi-slot-input"
            />

          </FormWrapper>
        </ScrollView>
      </ScrollContainer>
    </Wrapper>
  )
}
