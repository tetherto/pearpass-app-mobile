import { Children, cloneElement } from 'react'

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
    {Children.toArray(children)
      .filter((child) => child !== null)
      .map((child, index, arr) =>
        cloneElement(child, {
          isFirst: index === 0,
          isLast: index === arr.length - 1
        })
      )}
  </CompoundFieldComponent>
)
