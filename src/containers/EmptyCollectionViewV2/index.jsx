import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Add, ImportOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'

import { createStyles } from './styles'

export const EmptyCollectionViewV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.title}>{t`No item saved`}</Text>
      <Text variant="label" style={styles.description}>
        {t`Start using PearPass creating your first item or import your items from a different password manager`}
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          variant="primary"
          fullWidth
          iconBefore={<Add />}
          onClick={() =>
            navigation.navigate('CreateRecord', { recordType: 'login' })
          }
        >
          {t`Add item`}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          iconBefore={<ImportOutlined color={theme.colors.colorTextPrimary} />}
          onClick={() => navigation.navigate('Settings', { screen: 'Vaults' })}
        >
          {t`Import items`}
        </Button>
      </View>
    </View>
  )
}
