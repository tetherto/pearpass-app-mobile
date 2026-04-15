import { DeleteIcon } from '@tetherto/pearpass-lib-ui-react-native-components'

import { ButtonLittle } from '../../libComponents'
import { FormGroup } from '../FormGroup'
import { InputFieldNote } from '../InputFieldNote'

export const CustomFields = ({
  customFields,
  register,
  removeItem,
  areInputsDisabled,
  onClick
}) => (
  <>
    {customFields?.map((customField, index) => {
      if (customField.type === 'note') {
        return (
          <FormGroup
            key={customField.id}
            testID="new-comment-field"
            accessibilityLabel="New comment field"
          >
            <InputFieldNote
              isDisabled={areInputsDisabled}
              additionalItems={
                !areInputsDisabled && (
                  <ButtonLittle
                    startIcon={DeleteIcon}
                    variant="secondary"
                    borderRadius="md"
                    onPress={() => removeItem?.(index)}
                    testID="delete-new-comment-field-button"
                    accessibilityLabel="Delete new comment field button"
                  />
                )
              }
              isFirst
              isLast
              onClick={() => onClick?.(customField.note)}
              testID="new-comment-input-field"
              accessibilityLabel="New comment input field"
              inputAccessibilityLabel="New comment input field"
              {...register('note', index)}
            />
          </FormGroup>
        )
      }
    })}
  </>
)
