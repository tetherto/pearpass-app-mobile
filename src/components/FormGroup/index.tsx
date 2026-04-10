import { Children, cloneElement, isValidElement, useCallback, useState } from 'react'
import { ReactNode } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { View } from 'react-native'
import { Title, TitleWrapper, Wrapper } from './styles'

interface FormGroupProps {
  children: ReactNode
  title?: string
  isCollapse?: boolean      // optional
  onToggle?: (isOpen: boolean) => void
  isOpened?: boolean
}

type FormGroupChildProps = {
  index?: number
  isFirst?: boolean
  isLast?: boolean
  onFocus?: () => void
  focusedIndex?: number | null
}

export const FormGroup = ({
  title,
  isCollapse = false,       // default value
  children,
  onToggle,
  isOpened = true
}: FormGroupProps) => {
  const [isOpen, setIsOpen] = useState(isOpened)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handleFocusIndexSet = useCallback((index: number) => {
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
            .filter((child): child is React.ReactElement<FormGroupChildProps> =>
              isValidElement<FormGroupChildProps>(child)
            )
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
