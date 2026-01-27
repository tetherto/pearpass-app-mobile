import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ButtonLittle } from '../../../libComponents'
import { ExportSection } from '../TabExport'
import { ImportSection } from '../TabImport'
import { VaultsManageSection } from '../TabVaultsSettings'

export const Vaults = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>{t`Vaults`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VaultsManageSection />
        <ExportSection />
        <ImportSection />
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
  }
})
