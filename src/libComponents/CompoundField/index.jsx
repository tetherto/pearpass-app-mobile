import { CompoundFieldComponent } from './styles'

/**
 * @param {{
 * children: ReactNode
 * isDisabled: boolean
 * testID?: string
 * accessibilityLabel?: string
 * nativeID?: string
 * }} props
 */
export const CompoundField = ({ children, isDisabled, testID, accessibilityLabel, nativeID }) => (
  <CompoundFieldComponent 
    isDisabled={isDisabled}
    testID={testID}
    nativeID={nativeID ?? testID}
    accessibilityLabel={accessibilityLabel ?? testID}
  >
    {children}
  </CompoundFieldComponent>
)
