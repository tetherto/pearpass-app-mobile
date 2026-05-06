import { useLingui } from '@lingui/react/macro'
import {
  PageHeader,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { ReportProblem } from '@tetherto/pearpass-lib-ui-kit/icons'
import { ScrollView, StyleSheet, View } from 'react-native'

import { OnboardingLayout } from '../OnboardingV2/components/OnboardingLayout'

export const ErrorScreen = () => {
  const { t } = useLingui()
  const { theme } = useTheme()

  return (
    <OnboardingLayout topGradient>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.topSection}>
          <PageHeader title={t`Something went wrong`} style={styles.header} />

          <View style={styles.descriptionBlock}>
            <Text
              variant="body"
              color={theme.colors.colorTextSecondary}
              style={styles.descriptionLine}
            >
              {t`We hit an unexpected error.`}
            </Text>
            <Text
              variant="body"
              color={theme.colors.colorTextSecondary}
              style={styles.descriptionLine}
            >
              {t`Please close and reopen the app to continue.`}
            </Text>
          </View>

          <View
            style={[
              styles.statusStrip,
              { borderColor: theme.colors.colorBorderPrimary }
            ]}
            testID="error-screen-status"
          >
            <View style={styles.statusLeft}>
              <ReportProblem
                width={20}
                height={20}
                style={{ color: theme.colors.colorTextSecondary }}
              />
              <Text variant="body" color={theme.colors.colorTextSecondary}>
                {t`App needs a restart`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing40
  },
  topSection: {
    paddingTop: rawTokens.spacing60,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: rawTokens.spacing6
  },
  descriptionBlock: {
    width: '100%',
    gap: rawTokens.spacing4,
    alignItems: 'center'
  },
  descriptionLine: {
    textAlign: 'center',
    width: '100%'
  },
  statusStrip: {
    marginTop: rawTokens.spacing24,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: rawTokens.spacing10,
    borderWidth: 1,
    paddingVertical: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing10,
    backgroundColor: 'transparent'
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    flexShrink: 1
  }
})
