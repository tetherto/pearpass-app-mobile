import { Buffer } from 'buffer'

import { generateAvatarInitials } from '@tetherto/pear-apps-utils-avatar-initials'
import {
  CheckIcon,
  StarIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useFavicon } from '@tetherto/pearpass-lib-vault'

import {
  AvatarImage,
  AvatarInitials,
  FavoriteBadge,
  ItemImageContainer
} from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../constants/recordColorByType'

global.Buffer = global.Buffer || Buffer

/**
 *
 * @param {{
 *  record: any,
 *  size: 'sm' | 'md' | 'lg',
 *  isSelected: boolean,
 *  websiteDomain?: string,
 *  isFavorite?: boolean
 * }} param0
 * @returns
 */
export const AvatarRecord = ({
  record,
  size = 'sm',
  isSelected,
  websiteDomain,
  isFavorite
}) => {
  const { faviconSrc } = useFavicon({ url: websiteDomain })

  if (isSelected) {
    return (
      <ItemImageContainer isSelected={isSelected} size={size}>
        <CheckIcon color={colors.black.mode1} size="28" />
      </ItemImageContainer>
    )
  }

  return (
    <ItemImageContainer isSelected={isSelected} size={size}>
      {faviconSrc ? (
        <AvatarImage
          testID="avatar-image"
          source={{ uri: faviconSrc }}
          size={size}
        />
      ) : (
        <AvatarInitials size={size} color={RECORD_COLOR_BY_TYPE[record.type]}>
          {generateAvatarInitials(record.data?.title)}
        </AvatarInitials>
      )}
      {(isFavorite ?? record.isFavorite) && (
        <FavoriteBadge testID="favorite-badge">
          <StarIcon fill color={colors.primary400.mode1} />
        </FavoriteBadge>
      )}
    </ItemImageContainer>
  )
}
