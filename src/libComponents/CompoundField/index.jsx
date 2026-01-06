import { CompoundFieldComponent } from './styles'

/**
 * @param {{
 * children: ReactNode
 * isDisabled: boolean
 * testID?: string
 * }} props
 */
export const CompoundField = ({ children, isDisabled, testID }) => (
  <CompoundFieldComponent isDisabled={isDisabled} testID={testID}>
    {children}
  </CompoundFieldComponent>
)
