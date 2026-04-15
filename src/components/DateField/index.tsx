import { ComponentProps } from 'react'

import { InputField } from '@tetherto/pearpass-lib-ui-kit'

export type DateFieldPickerMode = 'date' | 'time' | 'datetime' | 'month-year'

export type DateFieldProps = ComponentProps<typeof InputField> & {
  pickerMode?: DateFieldPickerMode
}

export const DateField = ({
  pickerMode: _pickerMode = 'date',
  ...props
}: DateFieldProps) => <InputField {...props} />
