import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { Folder } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  CheckIcon: () => 'CheckIcon',
  KebabMenuIcon: () => 'KebabMenuIcon'
}))

const mockCollapse = jest.fn()
jest.mock('../../context/BottomSheetContext', () => ({
  useBottomSheet: () => ({
    collapse: mockCollapse
  }),
  BottomSheetProvider: ({ children }) => children
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('Folder component', () => {
  const mockOnFolderSelect = jest.fn()
  const mockOnCreateNewFolder = jest.fn()

  const folderData = {
    name: 'Test Folder',
    count: 5,
    icon: <View testID="folder-icon" />
  }

  const createNewFolderData = {
    name: 'Create New Folder',
    isCreateNew: true,
    icon: <View testID="create-folder-icon" />
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders folder correctly', () => {
    const { getByText, toJSON } = renderWithProviders(
      <Folder
        folder={folderData}
        isLast={false}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={false}
      />
    )

    expect(getByText('Test Folder')).toBeTruthy()
    expect(getByText('5 items')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('renders active folder with check icon', () => {
    const { toJSON } = renderWithProviders(
      <Folder
        folder={folderData}
        isLast={false}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={true}
      />
    )

    expect(toJSON()).toMatchSnapshot()
  })

  test('renders create new folder option without count', () => {
    const { getByText, queryByText, toJSON } = renderWithProviders(
      <Folder
        folder={createNewFolderData}
        isLast={true}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={false}
      />
    )

    expect(getByText('Create New Folder')).toBeTruthy()
    expect(queryByText('items')).toBeNull()
    expect(toJSON()).toMatchSnapshot()
  })

  test('calls collapse and onFolderSelect when regular folder is pressed', () => {
    const { getByText } = renderWithProviders(
      <Folder
        folder={folderData}
        isLast={false}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={false}
      />
    )

    fireEvent.press(getByText('Test Folder'))

    expect(mockCollapse).toHaveBeenCalledTimes(1)
    expect(mockOnFolderSelect).toHaveBeenCalledWith(folderData)
    expect(mockOnCreateNewFolder).not.toHaveBeenCalled()
  })

  test('calls collapse and onCreateNewFolder when create new folder is pressed', () => {
    const { getByText } = renderWithProviders(
      <Folder
        folder={createNewFolderData}
        isLast={true}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={false}
      />
    )

    fireEvent.press(getByText('Create New Folder'))

    expect(mockCollapse).toHaveBeenCalledTimes(1)
    expect(mockOnCreateNewFolder).toHaveBeenCalledTimes(1)
    expect(mockOnFolderSelect).not.toHaveBeenCalled()
  })

  test('renders folder with zero count', () => {
    const zeroCountFolder = {
      ...folderData,
      count: 0
    }

    const { getByText } = renderWithProviders(
      <Folder
        folder={zeroCountFolder}
        isLast={false}
        onFolderSelect={mockOnFolderSelect}
        onCreateNewFolder={mockOnCreateNewFolder}
        isActive={false}
      />
    )

    expect(getByText('0 items')).toBeTruthy()
  })
})
