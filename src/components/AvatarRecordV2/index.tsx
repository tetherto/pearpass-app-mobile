import { generateAvatarInitials } from '@tetherto/pear-apps-utils-avatar-initials'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { StarFilled } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFavicon } from '@tetherto/pearpass-lib-vault'
import { Image, StyleSheet, Text, View } from 'react-native'

import { RECORD_COLOR_BY_TYPE } from '../../constants/recordColorByType'

type AvatarSize = 'sm' | 'md' | 'lg'

type RecordLike = {
  type: string
  data?: { title?: string }
  isFavorite?: boolean
}

type Props = {
  record: RecordLike
  size?: AvatarSize
  websiteDomain?: string
  isFavorite?: boolean
  testID?: string
}

const SIZES: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40
}

const FONT_SIZES: Record<AvatarSize, number> = {
  sm: rawTokens.fontSize12,
  md: rawTokens.fontSize14,
  lg: rawTokens.fontSize16
}

const STAR_SIZES: Record<AvatarSize, number> = {
  sm: 10,
  md: 12,
  lg: 14
}

export const AvatarRecordV2 = ({
  record,
  size = 'md',
  websiteDomain,
  isFavorite,
  testID
}: Props) => {
  const { theme } = useTheme()
  const { faviconSrc, isLoading } = useFavicon({ url: websiteDomain })

  const isFaviconLoaded = !!faviconSrc && !isLoading
  const dimension = SIZES[size]
  const fontSize = FONT_SIZES[size]
  const showFavorite = isFavorite ?? !!record.isFavorite
  const typeColor =
    RECORD_COLOR_BY_TYPE[record.type as keyof typeof RECORD_COLOR_BY_TYPE] ??
    RECORD_COLOR_BY_TYPE.custom

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          backgroundColor: theme.colors.colorSurfaceElevatedOnInteraction,
          borderRadius: rawTokens.radius8
        }
      ]}
      testID={testID}
    >
      {isFaviconLoaded ? (
        <Image
          source={{ uri: faviconSrc }}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: rawTokens.radius8
          }}
          resizeMode="cover"
          testID={testID ? `${testID}-favicon` : undefined}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: typeColor }]}>
          {generateAvatarInitials(record.data?.title)}
        </Text>
      )}
      {showFavorite && (
        <View
          style={[
            styles.favoriteBadge,
            { backgroundColor: theme.colors.colorSurfacePrimary }
          ]}
          testID={testID ? `${testID}-favorite` : undefined}
        >
          <StarFilled
            width={STAR_SIZES[size]}
            height={STAR_SIZES[size]}
            color={theme.colors.colorPrimary}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    position: 'relative'
  },
  initials: {
    textAlign: 'center'
  },
  favoriteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
