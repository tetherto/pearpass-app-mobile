import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  sendGoogleFormFeedback,
  sendSlackFeedback
} from 'pear-apps-lib-feedback'
import { PRIVACY_POLICY, TERMS_OF_USE } from 'pearpass-lib-constants'
import {
  BackIcon,
  OutsideLinkIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { version } from '../../../../package.json'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import {
  GOOGLE_FORM_KEY,
  GOOGLE_FORM_MAPPING,
  SLACK_WEBHOOK_URL_PATH
} from '../../../constants/feedback'
import { ButtonLittle } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import { ReportSection } from '../ReportSection'

export const About = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleReportProblem = async () => {
    if (!message?.length) {
      return
    }

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

      await sendSlackFeedback({
        webhookUrPath: SLACK_WEBHOOK_URL_PATH,
        ...payload
      })

      await sendGoogleFormFeedback({
        formKey: GOOGLE_FORM_KEY,
        mapping: GOOGLE_FORM_MAPPING,
        ...payload
      })

      setMessage('')

      setIsLoading(false)

      Toast.show({
        type: 'baseToast',
        text1: t`Feedback sent`,
        position: 'bottom',
        bottomOffset: 100
      })
    } catch (error) {
      logger.error('Error sending feedback:', error)

      setIsLoading(false)

      Toast.show({
        type: 'baseToast',
        text1: t`ERROR: Feedback not sent`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>{t`About`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReportSection
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          handleReportProblem={handleReportProblem}
        />

        <CardSingleSetting title={t`PearPass version`}>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Here you can find all the info about your app.`}
            </Text>
            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>{t`App version`}</Text>
              <Text style={styles.versionValue}>{version}</Text>
            </View>
            <TouchableOpacity onPress={() => Linking.openURL(TERMS_OF_USE)}>
              <Text style={styles.link}>{t`Terms of use`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY)}>
              <Text style={styles.link}>{t`Privacy statement`}</Text>
            </TouchableOpacity>
            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>{t`Visit our website`}</Text>
              <TouchableOpacity
                style={styles.websiteLink}
                onPress={() => Linking.openURL('https://pass.pears.com')}
              >
                <OutsideLinkIcon size="16" color={colors.primary400.mode1} />
                <Text style={styles.link}>pass.pears.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CardSingleSetting>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 20,
    paddingBottom: 0,
    height: '100%',
    gap: 20,
    backgroundColor: colors.grey500.mode1
  },
  header: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  screenTitle: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700'
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 40
  },
  sectionContent: {
    gap: 15
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  versionLabel: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400'
  },
  versionValue: {
    color: colors.primary400.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600'
  },
  link: {
    color: colors.primary400.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600'
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  }
})
