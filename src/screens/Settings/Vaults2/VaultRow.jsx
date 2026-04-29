import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ListItem,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { LockOutlined, PersonAdd } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

import { VaultActionsMenu } from './VaultActionsMenu'

export const VaultRow = ({
  vault,
  showDivider,
  onAddMember,
  vaultActions,
  isCurrentVault,
  onClick
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const styles = getStyles(theme)
  return (
    <View>
      <ListItem
        onClick={() => onClick?.()}
        platform="mobile"
        icon={
          <View style={styles.iconBadge}>
            <LockOutlined
              color={theme.colors.colorPrimary}
              width={18}
              height={18}
            />
          </View>
        }
        title={vault?.name ?? vault?.id}
        subtitle={t`Private`}
        rightElement={
          <View style={styles.actions}>
            {isCurrentVault && (
              <Button
                variant="tertiary"
                size="small"
                iconBefore={<PersonAdd color={theme.colors.colorTextPrimary} />}
                onClick={onAddMember}
              />
            )}
            {isCurrentVault ? (
              <VaultActionsMenu {...vaultActions} />
            ) : undefined}
          </View>
        }
      />

      {showDivider && (
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.colorBorderSecondary }
          ]}
        />
      )}
    </View>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rawTokens.spacing4
    },
    divider: {
      height: 1,
      marginLeft: rawTokens.spacing16
    },
    iconBadge: {
      width: 36,
      height: 36,
      borderRadius: rawTokens.radius8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.colorPrimary + '26'
    }
  })
