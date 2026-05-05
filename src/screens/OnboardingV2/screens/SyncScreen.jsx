import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, Title, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { KeyboardArrowRightFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Dimensions, StyleSheet, View } from 'react-native'
import Rive from 'rive-react-native'

import { OnboardingLayout } from '../components/OnboardingLayout'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const SyncScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.riveContainer}>
            <Rive
              resourceName="sync_without_the_cloud"
              autoplay
              style={styles.riveAnimation}
              testID="onboarding-v2-sync-media"
            />
          </View>

          <View style={styles.copyContainer}>
            <View style={styles.titleContainer}>
              <Title data-testid="onboarding-v2-sync-title">
                {t`Sync without the cloud`}
              </Title>
            </View>

            <View style={styles.descriptionContainer}>
              <Text
                as="p"
                color={theme.colors.colorTextPrimary}
                style={styles.description}
                data-testid="onboarding-v2-sync-description"
              >
                {t`Your devices connect directly to each other using peer-to-peer technology.\n\nNo cloud. No copies. No middlemen.`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigation.replace('OnboardingV2CreatePassword')}
            iconAfter={<KeyboardArrowRightFilled />}
            data-testid="onboarding-v2-sync-continue"
          >
            {t`Continue`}
          </Button>
        </View>
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 31,
    paddingTop: 64
  },
  riveContainer: {
    width: SCREEN_WIDTH * 0.82,
    height: SCREEN_WIDTH * 0.82,
    overflow: 'hidden'
  },
  riveAnimation: {
    width: '100%',
    height: '100%'
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%'
  },
  copyContainer: {
    alignItems: 'center'
  },
  titleContainer: {
    marginTop: 48,
    marginBottom: 14
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  description: {
    textAlign: 'center'
  }
})
