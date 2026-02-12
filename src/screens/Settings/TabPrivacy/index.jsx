import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AutofillSection } from './AutofillSection'
import { BlindPeeringSection } from './BlindPeeringSection'
import { PrivacySection } from './PrivacySection'
import { ButtonLittle } from '../../../libComponents'
import { settingsStyles } from '../styles'

export const TabPrivacy = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  return (
    <SafeAreaView
      style={settingsStyles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={settingsStyles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={settingsStyles.screenTitle}>{t`Advanced`}</Text>
      </View>
      <ScrollView contentContainerStyle={settingsStyles.contentContainer}>
        <PrivacySection />
        <BlindPeeringSection />
        <AutofillSection />
      </ScrollView>
    </SafeAreaView>
  )
}
