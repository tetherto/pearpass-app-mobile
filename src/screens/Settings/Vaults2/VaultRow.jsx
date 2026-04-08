import { useLingui } from '@lingui/react/macro'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { LockOutlined, PersonAdd } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
      <View style={styles.row}>
        <View style={iconBadgeStyle}>
          <LockOutlined
            color={theme.colors.colorPrimary}
            width={18}
            height={18}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: theme.colors.colorTextPrimary }]}
          >
            {vault?.name ?? vault?.id}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.colorTextSecondary }
            ]}
          >
            {t`Private`}
          </Text>
        </View>

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
      </View>

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12,
    gap: rawTokens.spacing12
  },
  textContainer: {
    flex: 1,
    gap: 2
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500'
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400'
  },
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
