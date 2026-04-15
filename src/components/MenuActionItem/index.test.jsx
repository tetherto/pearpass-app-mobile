import { render, fireEvent } from '@testing-library/react-native'

import { MenuActionItem } from './index'

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  CheckIcon: (props) => <mockCheckIcon {...props} testID="check-icon" />,
  KebabMenuIcon: (props) => (
    <mockKebabMenuIcon {...props} testID="kebab-menu-icon" />
  )
}))

jest.mock('./styles', () => {
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    MenuItemWrapper: (props) => <View testID="menu-item-wrapper" {...props} />,
    MenuItemContainer: (props) => (
      <TouchableOpacity testID="menu-item-container" {...props}>
        {props.children}
      </TouchableOpacity>
    ),
    ItemContainer: (props) => <View testID="item-container" {...props} />,
    RecordText: (props) => (
      <Text testID="record-text" {...props}>
        {props.children}
      </Text>
    ),
    MenuItemRightSide: (props) => (
      <View testID="menu-item-right-side" {...props} />
    )
  }
})

jest.mock('../../constants/recordActions', () => ({
  RECORD_ACTION_ICON_BY_TYPE: {
    sort: (props) => <mockSortIcon {...props} testID="sort-icon" />,
    recent: (props) => <mockRecentIcon {...props} testID="recent-icon" />,
    filter: (props) => <mockFilterIcon {...props} testID="filter-icon" />
  }
}))

jest.mock('../../context/SharedFilterContext', () => ({
  useSharedFilter: jest.fn(() => ({
    state: {
      sort: 'Name A-Z'
    }
  }))
}))

describe('MenuActionItem', () => {
  const onPressMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with item data', () => {
    const item = {
      type: 'sort',
      name: 'Name A-Z'
    }

    const { getByTestId, toJSON } = render(
      <MenuActionItem item={item} onPress={onPressMock} />
    )

    expect(getByTestId('record-text').props.children).toBe('Name A-Z')
    expect(getByTestId('sort-icon')).toBeTruthy()
    expect(getByTestId('check-icon')).toBeTruthy()
    expect(getByTestId('kebab-menu-icon')).toBeTruthy()

    expect(toJSON()).toMatchSnapshot()
  })

  it('calls onPress when pressed', () => {
    const item = {
      type: 'filter',
      name: 'Status'
    }

    const { getByTestId } = render(
      <MenuActionItem item={item} onPress={onPressMock} />
    )

    fireEvent.press(getByTestId('menu-item-container'))
    expect(onPressMock).toHaveBeenCalled()
  })

  it('does not show check icon for non-sort/recent types', () => {
    const item = {
      type: 'filter',
      name: 'Status'
    }

    const { queryByTestId } = render(
      <MenuActionItem item={item} onPress={onPressMock} />
    )

    expect(queryByTestId('check-icon')).toBeNull()
  })

  it('does not show check icon when name does not match state.sort', () => {
    const item = {
      type: 'sort',
      name: 'Date'
    }

    const { queryByTestId } = render(
      <MenuActionItem item={item} onPress={onPressMock} />
    )

    expect(queryByTestId('check-icon')).toBeNull()
  })

  it('shows check icon for sort type with matching name', () => {
    const item = {
      type: 'sort',
      name: 'Name A-Z'
    }

    const { getByTestId } = render(
      <MenuActionItem item={item} onPress={onPressMock} />
    )

    expect(getByTestId('check-icon')).toBeTruthy()
  })
})
