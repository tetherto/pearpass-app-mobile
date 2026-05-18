import { t } from '@lingui/core/macro'
import { useNavigation } from '@react-navigation/native'
import {
  ListItem,
  Text,
  Title,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useState } from 'react'
import { View } from 'react-native'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { styles } from './styles'
import type { MatchedCode } from './types'

// TODO: replace with real matched codes from the import pipeline
const placeholderMatchedCodes: MatchedCode[] = [
  {
    id: 'microsoft-365',
    importedTitle: 'Microsoft 365',
    matchedLoginTitle: 'Microsoft 365',
    matchedLoginSubtitle: 'name@microsoft.com'
  },
  {
    id: 'slack',
    importedTitle: 'Slack',
    matchedLoginTitle: 'Slack',
    matchedLoginSubtitle: 'name@slack.com'
  },
  {
    id: 'github',
    importedTitle: 'GitHub',
    matchedLoginTitle: 'GitHub',
    matchedLoginSubtitle: 'name@github.com'
  },
  {
    id: 'adobe',
    importedTitle: 'Adobe',
    matchedLoginTitle: 'Adobe',
    matchedLoginSubtitle: 'name@adobe.com'
  },
  {
    id: 'amazon',
    importedTitle: 'Amazon',
    matchedLoginTitle: 'Amazon',
    matchedLoginSubtitle: 'name@amazon.com'
  },
  {
    id: 'kickstarter',
    importedTitle: 'Kickstarter',
    matchedLoginTitle: 'Kickstarter',
    matchedLoginSubtitle: 'name@kickstarter.com'
  }
]

export const ImportCodesMatching = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [matchedCodes] = useState<MatchedCode[]>(placeholderMatchedCodes)

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Change Login Match`}
          onBack={navigation.goBack}
        />
      }
      contentStyle={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.captions}>
          <Title>{t`Change Login Match`}</Title>
          <Text color={theme.colors.colorTextSecondary} variant="label">
            {t`Review the imported codes and update any incorrect matches. Tap a row to change the matched login.`}
          </Text>
        </View>

        <View style={styles.listSection}>
          <View
            style={[
              styles.listWrapper,
              { borderColor: theme.colors.colorSurfaceDisabled }
            ]}
          >
            {matchedCodes.map((code) => (
              <ListItem
                platform="mobile"
                title={code.importedTitle}
                subtitle={code.matchedLoginSubtitle ?? code.matchedLoginTitle ?? t`No match`}
                testID={`import-codes-match-${code.id}`}
                showDivider
                onClick={() => {
                  // TODO: open match-selection sheet for this code
                }}
                rightElement={
                  <KeyboardArrowRightOutlined
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />
                }
                key={code.id}
              />
            ))}
          </View>
        </View>
      </View>
    </Layout>
  )
}
