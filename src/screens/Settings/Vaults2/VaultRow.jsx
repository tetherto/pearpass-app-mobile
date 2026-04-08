import { useLingui } from '@lingui/react/macro'
import { ListItem, rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { LockOutlined, PersonAdd } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { VaultActionsMenu } from './VaultActionsMenu'

export const VaultRow = ({
  vault,
  showDivider,
  onAddMember,
  vaultActions,
  iconBadgeStyle,
  isCurrentVault
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  return (
    <View>
      <ListItem
        platform="mobile"
        icon={
          <View style={iconBadgeStyle}>
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
              <TouchableOpacity onPress={onAddMember} hitSlop={8}>
                <PersonAdd
                  color={theme.colors.colorTextPrimary}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            )}
            <VaultActionsMenu {...vaultActions} />
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

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  divider: {
    height: 1,
    marginLeft: rawTokens.spacing16
  }
})
