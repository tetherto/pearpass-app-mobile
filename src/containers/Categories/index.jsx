import { useRecordCountsByType } from '@tetherto/pearpass-lib-vault'

import { Container } from './styles'
import { BadgeRecordCategory } from '../../components/BadgeRecordCategory'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'

export const Categories = ({ recordType, setRecordType }) => {
  const menuItems = useRecordMenuItems({
    exclude: ['password']
  })

  const { state } = useSharedFilter()

  const { data } = useRecordCountsByType({
    variables: {
      filters: {
        folder:
          state?.folder !== 'allFolder' && state?.folder !== 'favorite'
            ? state?.folder
            : '',
        ...(state?.isFavorite ? { isFavorite: true } : {})
      }
    }
  })

  return (
    <Container>
      {menuItems.map((item) => (
        <BadgeRecordCategory
          key={item.type}
          item={item}
          isActive={recordType === item.type}
          onPress={() => setRecordType(item.type)}
          quantity={data[item.type]}
        />
      ))}
    </Container>
  )
}
