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
          <FormGroup key={customField.id}>
            <InputFieldNote
              isDisabled={areInputsDisabled}
              additionalItems={
                !areInputsDisabled && (
                  <ButtonLittle
                    startIcon={DeleteIcon}
                    variant="secondary"
                    borderRadius="md"
                    onPress={() => removeItem?.(index)}
                  />
                )
              }
              isFirst
              isLast
              onClick={() => onClick?.(customField.note)}
              {...register('note', index)}
            />
          </FormGroup>
        )
      }
    })}
  </>
)
