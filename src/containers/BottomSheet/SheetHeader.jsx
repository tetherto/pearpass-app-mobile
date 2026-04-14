import { useLingui } from '@lingui/react/macro'
import {
  Button,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8
  },
  headerSpacer: {
    width: 40,
    height: 40
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center'
  }
}

export const SheetHeader = ({ title, onClose }) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text variant="bodyEmphasized" style={styles.headerTitle}>
          {title}
        </Text>
        <Button
          variant="tertiary"
          size="medium"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={onClose}
          aria-label={t`Close`}
        />
      </View>
    </>
  )
}
