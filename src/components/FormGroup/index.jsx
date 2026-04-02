import { Children, cloneElement, useCallback, useState } from 'react'

import {
  ArrowDownIcon,
  ArrowUpIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { View } from 'react-native'

import { Title, TitleWrapper, Wrapper } from './styles'

/**
 * @param {{
 *  children: ReactNode
 *  title?: string
 *  isCollapse: boolean
 *  onToggle?: (isOpen: boolean) => void
 *  isOpened?: boolean
 *
 * }} props
 */
export const FormGroup = ({
  title,
  isCollapse,
  children,
  onToggle,
  isOpened = true
}) => {
  const [isOpen, setIsOpen] = useState(isOpened)
  const [focusedIndex, setFocusedIndex] = useState(null)

  const handleFocusIndexSet = useCallback((index) => {
    setFocusedIndex(index)
  }, [])

  const handleToggle = () => {
    setIsOpen((isOpen) => !isOpen)
    onToggle?.(!isOpen)
  }

  return (
    <Wrapper>
      {!!title?.length && isCollapse && (
        <TitleWrapper onPress={handleToggle}>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <Title>{title}</Title>
        </TitleWrapper>
      )}
      {isOpen && (
        <View>
          {Children.toArray(children)
            .filter((child) => child !== null)
            .map((child, index, filteredArray) =>
              cloneElement(child, {
                index,
                isFirst: index === 0,
                isLast: index === filteredArray.length - 1,
                onFocus: () => handleFocusIndexSet(index),
                focusedIndex
              })
            )}
        </View>
      )}
    </Wrapper>
  )
}
