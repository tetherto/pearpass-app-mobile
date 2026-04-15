import { render, fireEvent } from '@testing-library/react-native'
import { Animated } from 'react-native'

import { BackDrop } from './index'

describe('BackDrop component', () => {
  test('renders correctly', () => {
    const onPress = jest.fn()
    const animatedOpacity = new Animated.Value(1)
    const { getByTestId, toJSON } = render(
      <BackDrop
        animatedOpacity={animatedOpacity}
        onPress={onPress}
        testID="backdrop"
      />
    )

    const backdrop = getByTestId('backdrop')
    expect(backdrop).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const animatedOpacity = new Animated.Value(1)
    const { getByTestId } = render(
      <BackDrop
        animatedOpacity={animatedOpacity}
        onPress={onPress}
        testID="backdrop"
      />
    )

    fireEvent.press(getByTestId('backdrop'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
