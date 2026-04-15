import { useState } from 'react'

import {
  ArrowDownIcon,
  ArrowUpIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'

import {
  Dropdown,
  DropdownItem,
  DropdownText,
  SelectBox,
  SelectedText
} from './styles'

/**
 * @param {{
 *  value: string,
 *  onChange?: (value: string) => void,
 *  options: { label: string, value: string }[]
 * }} props
 */
export const SelectInput = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val)
    }
    setOpen(false)
  }

  const selectedLabel =
    options.find((o) => o.value === value)?.label || 'Select'

  return (
    <>
      <SelectBox
        onPress={() => setOpen((prev) => !prev)}
        accessibilityRole="button"
      >
        <SelectedText>{selectedLabel}</SelectedText>
        {open ? <ArrowUpIcon size="14" /> : <ArrowDownIcon size="14" />}
      </SelectBox>

      {open && (
        <Dropdown>
          {options.map((option) => (
            <DropdownItem
              key={option.value}
              onPress={() => handleSelect(option.value)}
            >
              <DropdownText>{option.label}</DropdownText>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </>
  )
}
