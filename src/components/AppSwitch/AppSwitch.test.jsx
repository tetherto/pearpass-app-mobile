import { render, fireEvent } from '@testing-library/react-native'

import { AppSwitch } from './AppSwitch'

describe('AppSwitch', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<AppSwitch />)
    expect(toJSON()).toBeTruthy()
  })

  it('calls onChange when pressed', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <AppSwitch value={false} onChange={onChange} testID="switch" />
    )
    fireEvent.press(getByTestId('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when value is true', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <AppSwitch value={true} onChange={onChange} testID="switch" />
    )
    fireEvent.press(getByTestId('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <AppSwitch value={false} onChange={onChange} disabled testID="switch" />
    )
    fireEvent.press(getByTestId('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders with custom colors', () => {
    const { toJSON } = render(
      <AppSwitch
        trackColorTrue="#00ff00"
        trackColorFalse="#ff0000"
        thumbColor="#0000ff"
      />
    )
    expect(toJSON()).toBeTruthy()
  })
})
