import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  CommonFileIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { View } from 'react-native'

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
      <Label
        onPress={() => setIsOpen(!isOpen)}
        testID={
          isOpen
            ? 'сollapse-create-custom-field-button'
            : 'expand-create-custom-field-button'
        }
        accessibilityLabel={
          isOpen
            ? 'Сollapse create custom field button'
            : 'Expand create custom field button'
        }
      >
        <View
          testID="create-custom-field-plus-icon"
          accessibilityLabel="Create custom field plus icon"
        >
          <PlusIcon size="21" />
        </View>

        <LabelText
          testID="create-custom-field-text"
          accessibilityLabel="Create custom field text"
        >{t`Create Custom`}</LabelText>

        <ArrowIconWrapper>
          {isOpen ? <ArrowUpIcon size="21" /> : <ArrowDownIcon size="21" />}
        </ArrowIconWrapper>
      </Label>

      {isOpen && (
        <DropDown>
          {options.map((option) => (
            <View
              key={option.type}
              testID="add-new-comment-field"
              accessibilityLabel="Add new comment field"
            >
              <ButtonFilter
                variant="secondary"
                startIcon={option.icon}
                onPress={() => handleSelect(option.type)}
                testID="add-new-comment-button"
                accessibilityLabel="Add new comment button"
              >
                {option.name}
              </ButtonFilter>
            </View>
          ))}
        </DropDown>
      )}
    </Wrapper>
  )
}
