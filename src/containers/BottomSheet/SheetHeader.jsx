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
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing8
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 10
  },
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
      <View style={styles.dragHandleArea}>
        <View
          style={[
            styles.dragHandle,
            {
              backgroundColor: theme.colors.colorSurfaceElevatedOnInteraction
            }
          ]}
        />
      </View>
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
