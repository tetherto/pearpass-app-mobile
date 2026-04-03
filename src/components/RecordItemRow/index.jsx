import { generateAvatarInitials } from '@tetherto/pear-apps-utils-avatar-initials'
import { Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useFavicon } from '@tetherto/pearpass-lib-vault'
import { Image, View } from 'react-native'

import { createStyles } from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../constants/recordColorByType'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

export const RecordItemRow = ({ record, style }) => {
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  const websiteDomain =
    record.type === 'login' ? record?.data?.websites?.[0] : null
  const { faviconSrc } = useFavicon({ url: websiteDomain })
  const subtitle = getRecordSubtitle(record)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        {faviconSrc ? (
          <Image
            source={{ uri: faviconSrc }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        ) : (
          <Text
            variant="label"
            style={{
              color: RECORD_COLOR_BY_TYPE[record.type],
              fontWeight: '700'
            }}
          >
            {generateAvatarInitials(record.data?.title)}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <Text variant="labelEmphasized" numberOfLines={1}>
          {record.data?.title}
        </Text>
        {!!subtitle && (
          <Text
            variant="label"
            numberOfLines={1}
            style={{ color: theme.colors.colorTextSecondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  )
}
