import { useState } from 'react'

import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react/macro'
import {
  sendGoogleFormFeedback,
  sendSlackFeedback
} from 'pear-apps-lib-feedback'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

import { DeviceSection } from './DeviceSection'
import { LanguageSection } from './LanguageSection'
import { ReportSection } from './ReportSection'
import { ManageVaultsContainer, Version } from './styles'
import { version } from '../../../../package.json'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import {
  GOOGLE_FORM_KEY,
  GOOGLE_FORM_MAPPING,
  SLACK_WEBHOOK_URL_PATH
} from '../../../constants/feedback'
import { ModifyMasterVaultModalContent } from '../../../containers/Modal/ModifyMasterVaultModalContent'
import { useModal } from '../../../context/ModalContext'
import { useLanguageOptions } from '../../../hooks/useLanguageOptions'
import { logger } from '../../../utils/logger'

export const TabGeneralSettings = () => {
  const { t } = useLingui()
  const [language, setLanguage] = useState(i18n.locale)
  const { openModal } = useModal()
  const handleChangeLanguage = (newLang) => {
    setLanguage(newLang)
    i18n.activate(newLang)
  }

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { languageOptions } = useLanguageOptions()

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
  const handleMasterEditClick = () => {
    openModal(<ModifyMasterVaultModalContent />)
  }

  return (
    <>
      <LanguageSection
        language={language}
        setLanguage={handleChangeLanguage}
        title={t`Language`}
        languageOptions={languageOptions}
      />

      <CardSingleSetting title={t`Passwords`}>
        <ManageVaultsContainer>
          <ListItem
            name={t`Master Vault`}
            onEditClick={handleMasterEditClick}
          />
        </ManageVaultsContainer>
      </CardSingleSetting>

      <ReportSection
        message={message}
        setMessage={setMessage}
        isLoading={isLoading}
        handleReportProblem={handleReportProblem}
      />

      <DeviceSection />

      <CardSingleSetting title={t`Version`}>
        <Version>{version}</Version>
      </CardSingleSetting>
    </>
  )
}
