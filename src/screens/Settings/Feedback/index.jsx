import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import NetInfo from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import {
  sendGoogleFormFeedback,
  sendSlackFeedback
} from '@tetherto/pear-apps-lib-feedback'
import {
  AlertMessage,
  Button,
  InputField,
  PageHeader,
  TextArea,
  rawTokens,
  useTheme,
  Text
} from '@tetherto/pearpass-lib-ui-kit'
import { InfoFilled, Send } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Platform, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'

import { version } from '../../../../package.json'
import {
  GOOGLE_FORM_KEY,
  GOOGLE_FORM_MAPPING,
  SLACK_WEBHOOK_URL_PATH
} from '../../../constants/feedback'
import { logger } from '../../../utils/logger'

const isEmailSupported = false
export const Feedback = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const colors = theme.colors
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!message?.length) return

    try {
      setIsLoading(true)

      const payload = {
        message,
        topic: 'BUG_REPORT',
        app: 'MOBILE',
        operatingSystem: Platform.OS,
        deviceModel: Platform.constants.Brand,
        appVersion: version
      }

      const slackResult = await sendSlackFeedback({
        webhookUrPath: SLACK_WEBHOOK_URL_PATH,
        ...payload
      })

      const googleResult = await sendGoogleFormFeedback({
        formKey: GOOGLE_FORM_KEY,
        mapping: GOOGLE_FORM_MAPPING,
        ...payload
      })

      if (!slackResult && !googleResult) {
        const { isConnected } = await NetInfo.fetch()
        if (!isConnected) throw new Error('OFFLINE')
        throw new Error('SEND_FAILED')
      }
      setMessage('')
      if (isEmailSupported) {
        setEmail('')
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Feedback sent`,
        position: 'bottom',
        bottomOffset: 100
      })
    } catch (error) {
      logger.error('Error sending feedback:', error)

      Toast.show({
        type: 'baseToast',
        text1:
          error.message === 'OFFLINE'
            ? t`You are offline, please check your internet connection`
            : t`ERROR: Feedback not sent`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setIsLoading(false)
    }
  }
  const isDisabled = isLoading || !message.length
  const buttonContentColor = isDisabled
    ? colors.colorTextDisabled
    : colors.colorOnPrimary
  return (
    <ScreenLayout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        <Button
          variant="primary"
          fullWidth
          disabled={isDisabled}
          isLoading={isLoading}
          onClick={handleSend}
        >
          <View style={styles.sendButton}>
            <Send color={buttonContentColor} />
            <Text color={buttonContentColor}>{t`Send`}</Text>
          </View>
        </Button>
      }
    >
      <PageHeader
        title={t`Report a problem`}
        subtitle={t`Tell us what's going wrong and leave your email so we can follow up with you.`}
      />

      <View style={styles.fieldsContainer}>
        <TextArea
          label={t`Report a problem`}
          placeholder={t`Write your issue`}
          value={message}
          onChange={setMessage}
          testID="feedback-message-input"
        />
        {isEmailSupported && (
          <InputField
            label={t`Email`}
            placeholder={t`Write your email`}
            value={email}
            onChangeText={setEmail}
            inputType="email"
            testID="feedback-email-input"
          />
        )}
      </View>

      {isEmailSupported && (
        <AlertMessage
          variant="success"
          size="small"
          icon={<InfoFilled color={colors.colorTextPrimary} />}
          description={t`We'll use your email only to follow up with you. It won't be stored or used for anything else.`}
        />
      )}
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing8,
    flexGrow: 1
  },
  fieldsContainer: {
    gap: rawTokens.spacing12,
    marginTop: rawTokens.spacing16
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    display: 'flex'
  },
  pageHeader: {
    marginTop: rawTokens.spacing16
  }
})
