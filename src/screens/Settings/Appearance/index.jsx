import { useState } from 'react'

import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { SelectInput } from '../../../components/SelectInput'
import { useLanguageOptions } from '../../../hooks/useLanguageOptions'
import { ButtonLittle } from '../../../libComponents'

export const Appearance = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { languageOptions } = useLanguageOptions()

  const [language, setLanguage] = useState(i18n.locale)

  const handleChangeLanguage = async (newLang) => {
    await setLanguage(() => newLang)
    i18n.activate(newLang)
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
        <Text style={styles.screenTitle}>{t`Appearance`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CardSingleSetting title={t`Language`}>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Choose the language of the app.`}
            </Text>
            <SelectInput
              value={language}
              onChange={handleChangeLanguage}
              options={languageOptions}
            />
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
  }
})
