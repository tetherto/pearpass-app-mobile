import { useLingui } from '@lingui/react/macro'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { ActivityIndicator, StyleSheet, Text } from 'react-native'

import { ReportProblemContainer } from './styles'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ButtonSecondary, TextAreaReport } from '../../../libComponents'

/**
 *
 * @param {Object} props
 * @param {string} props.message
 * @param {Function} props.setMessage
 * @param {boolean} props.isLoading
 * @param {Function} props.handleReportProblem
 *
 */
export const ReportSection = ({
  message,
  setMessage,
  isLoading,
  handleReportProblem
}) => {
  const { t } = useLingui()

  return (
    <CardSingleSetting title={t`Report a problem`}>
      <ReportProblemContainer>
        <Text style={styles.description}>
          {t`Tell us what's going wrong and leave your email so we can follow up with you.`}
        </Text>
        <TextAreaReport
          placeholder={t`Write your issue...`}
          value={message}
          onChange={(text) => setMessage(text)}
          testID="report-problem-issue-input"
          accessibilityLabel={t`Write your issue`}
        />

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary400.mode1} />
        ) : (
          <ButtonSecondary size="sm" onPress={handleReportProblem}>
            {t`Send`}
          </ButtonSecondary>
        )}
      </ReportProblemContainer>
    </CardSingleSetting>
  )
}

const styles = StyleSheet.create({
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  }
})
