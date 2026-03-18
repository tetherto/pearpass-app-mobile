import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { ToolbarCreateOrEditCategory } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn()
  })
}))

jest.mock('../../context/BottomSheetContext', () => ({
  useBottomSheet: () => ({
    expand: jest.fn()
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => {
  const { Text } = require('react-native')

  return {
    ButtonLittle: ({ onPress, children, ...props }) => (
      <Text {...props} testID="button-little" onPress={onPress}>
        {children || 'ButtonLittle'}
      </Text>
    ),
    SaveIcon: () => <Text testID="save-icon">SaveIcon</Text>,
    XIcon: () => <Text testID="x-icon">XIcon</Text>
  }
})

jest.mock('../FolderDropDown', () => {
  const { Text } = require('react-native')

  return {
    FolderDropDown: ({ onPress, selectedFolder }) => (
      <Text
        testID="folder-dropdown"
        onPress={onPress}
        data-selectedfolder={selectedFolder?.id}
      >
        FolderDropDown
      </Text>
    )
  }
})

jest.mock('./styles', () => {
  const { View } = require('react-native')

  return {
    RecordFormHeader: ({ children }) => (
      <View testID="record-form-header">{children}</View>
    ),
    RecordFormHeaderActions: ({ children }) => (
      <View testID="record-form-header-actions">{children}</View>
    )
  }
})

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native')

  return {
    BottomSheet: ({ children }) => <View>{children}</View>
  }
})

jest.mock('../../containers/BottomSheetFolderListContent', () => {
  const { View } = require('react-native')

  return {
    BottomSheet: ({ children }) => <View>{children}</View>
  }
})

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('ToolbarCreateOrEditCategory component', () => {
  const defaultProps = {
    onSave: jest.fn(),
    onFolderSelect: jest.fn(),
    selectedFolder: { id: '123', name: 'Test Folder' }
  }

  test('renders correctly with all components', () => {
    const { getByTestId, toJSON } = renderWithProviders(
      <ToolbarCreateOrEditCategory {...defaultProps} />
    )

    expect(getByTestId('record-form-header')).toBeTruthy()
    expect(getByTestId('record-form-header-actions')).toBeTruthy()
    expect(getByTestId('folder-dropdown')).toBeTruthy()
    expect(getByTestId('save-icon')).toBeTruthy()
    expect(getByTestId('x-icon')).toBeTruthy()

    expect(toJSON()).toMatchSnapshot()
  })

  test('calls onSave when save button is pressed', () => {
    const onSaveMock = jest.fn()
    const { getByText } = renderWithProviders(
      <ToolbarCreateOrEditCategory {...defaultProps} onSave={onSaveMock} />
    )

    const saveButton = getByText('Save')
    fireEvent.press(saveButton)
    expect(onSaveMock).toHaveBeenCalledTimes(1)
  })

  test('passes selectedFolder to FolderDropDown', () => {
    const testFolder = { id: 'test-folder-id', name: 'Test Folder' }
    const { getByTestId } = renderWithProviders(
      <ToolbarCreateOrEditCategory
        {...defaultProps}
        selectedFolder={testFolder}
      />
    )

    const folderDropdown = getByTestId('folder-dropdown')
    expect(folderDropdown.props['data-selectedfolder']).toBe(testFolder.id)
  })
})
