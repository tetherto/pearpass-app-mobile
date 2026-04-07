import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useTheme, ListItem, rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import {
  LockOutlined,
  KeyboardArrowRightFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated'

import { RECORD_ICON_BY_TYPE } from '../../constants/recordIconByType'

type VaultRecord = {
  id: string
  type: string
  data?: {
    title?: string
    username?: string
  }
}

type VaultPreviewCardProps = {
  vaultName: string
  records: VaultRecord[]
  defaultExpanded?: boolean
}

export const VaultPreviewCard = ({
  vaultName,
  records,
  defaultExpanded = true
}: VaultPreviewCardProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(defaultExpanded)

  const rotation = useSharedValue(defaultExpanded ? -90 : 90)

  const itemCount = records.length
  const subtitle = `${itemCount} ${itemCount === 1 ? t`Item` : t`Items`}`

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  const toggleExpanded = () => {
    const next = !expanded
    setExpanded(next)
    rotation.value = withTiming(next ? -90 : 90, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1)
    })
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderColor: theme.colors.colorBorderPrimary
        }
      ]}
      testID="import-vault-preview-card"
    >
      <ListItem
        onClick={toggleExpanded}
        testID="import-vault-toggle-expand"
        icon={
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.colorSurfaceElevatedOnInteraction }
            ]}
          >
            <LockOutlined
              width={16}
              height={16}
              color={theme.colors.colorAccentHover}
            />
          </View>
        }
        title={vaultName}
        subtitle={subtitle}
        platform="mobile"
        rightElement={
          <View style={styles.chevronButton}>
            <Animated.View style={animatedStyle}>
              <KeyboardArrowRightFilled
                width={20}
                height={20}
                color={theme.colors.colorTextSecondary}
              />
            </Animated.View>
          </View>
        }
      />

      {expanded && records.length > 0 && (
        <View
          style={[
            styles.itemList,
            { borderTopColor: theme.colors.colorBorderPrimary }
          ]}
        >
          {records.map((record) => {
            const IconComponent =
              RECORD_ICON_BY_TYPE[record.type] || RECORD_ICON_BY_TYPE.all

            return (
              <ListItem
                key={record.id}
                icon={
                  <View
                    style={[
                      styles.recordIconContainer,
                      { backgroundColor: theme.colors.colorSurfaceElevatedOnInteraction }
                    ]}
                  >
                    <IconComponent
                      size={16}
                      color={theme.colors.colorTextSecondary}
                    />
                  </View>
                }
                title={record.data?.title || t`Untitled`}
                subtitle={record.data?.username || undefined}
                platform="mobile"
              />
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.spacing8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chevronButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordIconContainer: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.spacing8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing12,
    overflow: 'hidden'
  },
  itemList: {
    borderTopWidth: 1
  }
})
