import { render, fireEvent } from '@testing-library/react-native'

import { ListItem } from './index'

jest.mock('pear-apps-utils-date', () => ({
  formatDate: jest.fn().mockReturnValue('01/01/2023')
}))

jest.mock('./styles', () => {
  const { View, Text, TouchableOpacity } = require('react-native')

  return {
    ListItemContainer: (props) => (
      <TouchableOpacity {...props} testID="vault-container">
        {props.children}
      </TouchableOpacity>
    ),
    ListItemInfo: (props) => <View testID="vault-info" {...props} />,
    ListItemDescription: (props) => (
      <View testID="vault-description" {...props} />
    ),
    ListItemName: (props) => (
      <Text testID="vault-name" {...props}>
        {props.children}
      </Text>
    ),
    ListItemDate: (props) => (
      <Text testID="vault-date" {...props}>
        {props.children}
      </Text>
    ),
    ListItemActions: (props) => <View testID="vault-actions" {...props} />,
    SelectedListItemIconContainer: (props) => (
      <View testID="selected-icon-container" {...props} />
    )
  }
})

jest.mock('pearpass-lib-ui-react-native-components', () => ({
  BrushIcon: () => 'BrushIcon',
  CheckIcon: () => 'CheckIcon',
  DeleteIcon: () => 'DeleteIcon',
  LockCircleIcon: () => 'LockCircleIcon',
  ShareIcon: () => 'ShareIcon'
}))

jest.mock('pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    primary400: { mode1: '#000000' },
    black: { mode1: '#000000' },
    white: { mode1: '#ffffff' }
  }
}))

describe('ListItem', () => {
  const mockProps = {
    name: 'Test Vault',
    date: '2023-01-01',
    onEditClick: () => {},
    onDeleteClick: () => {},
    onShareClick: () => {},
    onPress: jest.fn()
  }

  it('renders correctly with provided vault data', () => {
    const { getByTestId, toJSON } = render(<ListItem {...mockProps} />)

    expect(getByTestId('vault-name').props.children).toBe('Test Vault')
    expect(getByTestId('vault-date')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls onPress when ListItemContainer is pressed', () => {
    const { getByTestId } = render(<ListItem {...mockProps} />)

    fireEvent.press(getByTestId('vault-container'))
    expect(mockProps.onPress).toHaveBeenCalled()
  })

  it('renders actions when action callbacks are provided', () => {
    const { getByTestId } = render(<ListItem {...mockProps} />)

    expect(getByTestId('vault-actions')).toBeTruthy()
  })

  it('does not render action icons when callbacks are not provided', () => {
    const mockWithoutActionsProps = {
      name: 'Test Vault',
      date: '2023-01-01',
      onPress: jest.fn()
    }

    const { queryByTestId } = render(<ListItem {...mockWithoutActionsProps} />)

    const actionsContainer = queryByTestId('vault-actions')
    expect(actionsContainer).toBeTruthy()
    // When no callbacks are provided, the actions container should have no meaningful children
    // React filters out falsy values, so children should be undefined, null, or an array of falsy values
    const children = actionsContainer.props.children
    const hasNoChildren =
      !children ||
      (Array.isArray(children) && children.every((child) => !child)) ||
      children === null
    expect(hasNoChildren).toBeTruthy()
  })

  it('renders CheckIcon when isSelected is true', () => {
    const { getByTestId } = render(
      <ListItem {...mockProps} isSelected={true} />
    )

    expect(getByTestId('selected-icon-container')).toBeTruthy()
  })

  it('renders correctly when isLoading is true', () => {
    const { getByTestId } = render(<ListItem {...mockProps} isLoading={true} />)

    // Component should still render name and date when loading
    expect(getByTestId('vault-name').props.children).toBe('Test Vault')
    expect(getByTestId('vault-date')).toBeTruthy()
  })
})
