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

import { AvatarRecordV2 } from '../../components/AvatarRecordV2'

type VaultWebsite = string | { website?: string }

type VaultRecord = {
  id: string
  type: string
  isFavorite?: boolean
  data?: {
    title?: string
    username?: string
    email?: string
    websites?: VaultWebsite[]
  }
}

function loginWebsiteUrl(record: VaultRecord): string {
  if (record.type !== 'login') return ''
  const first = record.data?.websites?.[0]
  if (typeof first === 'string') return first
  if (first && typeof first === 'object' && typeof first.website === 'string') {
    return first.website
  }
  return ''
}

function getRecordSubtitle(record: VaultRecord): string | undefined {
  const d = record.data
  if (!d) return undefined
  if (record.type === 'login') {
    if (typeof d.username === 'string' && d.username) return d.username
    if (typeof d.email === 'string' && d.email) return d.email
    const url = loginWebsiteUrl(record)
    if (url) return url
  }
  return d.username || undefined
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
            const websiteDomain = loginWebsiteUrl(record)

            return (
              <ListItem
                key={record.id}
                icon={
                  <AvatarRecordV2
                    record={record}
                    size="md"
                    websiteDomain={websiteDomain}
                    testID={`import-vault-preview-avatar-${record.id}`}
                  />
                }
                title={record.data?.title || t`Untitled`}
                subtitle={getRecordSubtitle(record)}
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
  container: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing12,
    overflow: 'hidden'
  },
  itemList: {
    borderTopWidth: 1
  }
})
