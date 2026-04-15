import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, Title, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Add, ImportOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'

import { createStyles } from './styles'
import { ItemCardIllustration } from '../../svgs/ItemCardIllustration'

export const EmptyCollectionViewV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const styles = createStyles()

  return (
    <View style={styles.container}>
      <ItemCardIllustration />
      <View style={styles.title}>
        <Title style={styles.textCenter}>{t`No item saved`}</Title>
      </View>
      <View style={styles.description}>
        <Text
          variant="label"
          color={theme.colors.colorTextSecondary}
          style={styles.textCenter}
        >
          {t`Start using PearPass creating your first item or import your items from a different password manager`}
        </Text>
      </View>
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
          onClick={() => navigation.navigate('ImportItems')}
        >
          {t`Import items`}
        </Button>
      </View>
    </View>
  )
}
