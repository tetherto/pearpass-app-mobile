import { useMemo, useState } from 'react'

import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  ContextMenu,
  PageHeader,
  Radio,
  rawTokens,
  Text,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { ExpandMore } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SheetHeader } from '../../../containers/BottomSheet/SheetHeader'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { useLanguageOptions } from '../../../hooks/useLanguageOptions'

const LanguagePickerSheet = ({ options, selectedValue, onSelect }) => {
  const { t } = useLingui()
  const collapse = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()

  const handleSelect = (value) => {
    onSelect(value)
    collapse()
  }

  return (
    <Layout
      mode="sheet"
      contentStyle={{
        paddingHorizontal: rawTokens.spacing16,
        paddingBottom: bottom + rawTokens.spacing24
      }}
      header={<SheetHeader title={t`App Language`} onClose={collapse} />}
    >
      <Radio options={options} value={selectedValue} onChange={handleSelect} />
    </Layout>
  )
}

export const AppearanceV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { languageOptions } = useLanguageOptions()

  const [language, setLanguage] = useState(i18n.locale)

  const currentLabel = useMemo(
    () =>
      languageOptions.find((option) => option.value === language)?.label ??
      language,
    [language, languageOptions]
  )

  const handleSelect = (newLang) => {
    setLanguage(newLang)
    i18n.activate(newLang)
  }

  const styles = getStyles(theme)

  return (
    <Layout
      scrollable
      hideFooter
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.scrollContent}
    >
      <PageHeader
        title={t`Language`}
        subtitle={t`Choose the language of the app.`}
      />

      <View
        style={[styles.card, { borderColor: theme.colors.colorBorderPrimary }]}
      >
        <View style={styles.textBlock}>
          <Text variant="bodyEmphasized">{t`App Language`}</Text>
          <Text variant="label" color={theme.colors.colorTextSecondary}>
            {t`Select the language used throughout PearPass.`}
          </Text>
        </View>

        <ContextMenu
          trigger={
            <View
              style={[
                styles.selector,
                { borderColor: theme.colors.colorBorderPrimary }
              ]}
              testID="language-selector"
              accessibilityLabel="Language Selector"
            >
              <Text variant="body">{currentLabel}</Text>
              <ExpandMore color={theme.colors.colorTextPrimary} />
            </View>
          }
        >
          <LanguagePickerSheet
            options={languageOptions}
            selectedValue={language}
            onSelect={handleSelect}
          />
        </ContextMenu>
      </View>
    </Layout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    scrollContent: {
      paddingTop: rawTokens.spacing24,
      gap: rawTokens.spacing20,
      flexGrow: 1
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: rawTokens.spacing12,
      padding: rawTokens.spacing16,
      borderWidth: 1,
      borderRadius: rawTokens.spacing12,
      backgroundColor: theme.colors.colorSurfacePrimary
    },
    textBlock: {
      flex: 1,
      gap: rawTokens.spacing4
    },
    selector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rawTokens.spacing8,
      paddingHorizontal: rawTokens.spacing12,
      paddingVertical: rawTokens.spacing8,
      borderWidth: 1,
      borderRadius: rawTokens.spacing8
    }
  })
