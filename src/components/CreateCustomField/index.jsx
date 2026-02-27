import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  CommonFileIcon
} from 'pearpass-lib-ui-react-native-components'

import { ArrowIconWrapper, DropDown, Label, LabelText, Wrapper } from './styles'
import { ButtonFilter } from '../../libComponents'

export const CreateCustomField = ({
  onCreateCustom,
  testID,
  accessibilityLabel
}) => {
  const { t } = useLingui()

  const [isOpen, setIsOpen] = useState(false)

  const options = [
    // {
    //   name: 'Email',
    //   type: 'email',
    //   icon: EmailIcon
    // },
    // {
    //   name: 'Picture',
    //   type: 'picture',
    //   icon: ImageIcon
    // },
    {
      name: t`Comment`,
      type: 'note',
      icon: CommonFileIcon
    }
    // {
    //   name: 'Pin code',
    //   type: 'pinCode',
    //   icon: NineDotsIcon
    // },
    // {
    //   name: 'Date',
    //   type: 'date',
    //   icon: CalendarIcon
    // },
    // {
    //   name: 'Website',
    //   type: 'website',
    //   icon: WorldIcon
    // },
    // {
    //   name: 'Phone number',
    //   type: 'phoneNumber',
    //   icon: PhoneIcon
    // }
  ]

  const handleSelect = (type) => {
    onCreateCustom(type)

    setIsOpen(false)
  }

  return (
    <Wrapper testID={testID} accessibilityLabel={accessibilityLabel}>
      <Label onPress={() => setIsOpen(!isOpen)}>
        <PlusIcon size="21" />

        <LabelText>{t`Create Custom`}</LabelText>

        <ArrowIconWrapper>
          {isOpen ? <ArrowUpIcon size="21" /> : <ArrowDownIcon size="21" />}
        </ArrowIconWrapper>
      </Label>

      {isOpen && (
        <DropDown>
          {options.map((option) => (
            <ButtonFilter
              key={option.type}
              variant="secondary"
              startIcon={option.icon}
              onPress={() => handleSelect(option.type)}
            >
              {option.name}
            </ButtonFilter>
          ))}
        </DropDown>
      )}
    </Wrapper>
  )
}
