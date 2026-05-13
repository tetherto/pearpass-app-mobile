import { NavbarListItem } from '@tetherto/pearpass-lib-ui-kit'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SheetHeader } from './SheetHeader'

export const OptionsSheet = ({
  title,
  options,
  selectedValue,
  onSelect,
  onClose
}) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View>
      <SheetHeader showHandle title={title} onClose={onClose} />
      <View style={{ paddingBottom: bottom }}>
        {options.map((option, index) => (
          <NavbarListItem
            key={String(option.value)}
            label={option.label}
            selected={option.value === selectedValue}
            platform="mobile"
            showDivider={index < options.length - 1}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </View>
    </View>
  )
}
