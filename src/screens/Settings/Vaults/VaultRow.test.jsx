import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'

import { VaultRow } from './VaultRow'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => {
  const RN = require('react-native')
  return {
    LockOutlined: () => <RN.View testID="icon-lock" />,
    PersonAdd: () => <RN.View testID="icon-person-add" />
  }
})

jest.mock('./VaultActionsMenu', () => {
  const RN = require('react-native')
  return {
    VaultActionsMenu: () => <RN.View testID="vault-actions-menu" />
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')
  return {
    Button: ({ onClick, children }) => (
      <RN.TouchableOpacity testID="vault-row-add-member" onPress={onClick}>
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
    ListItem: ({
      title,
      subtitle,
      onClick,
      rightElement,
      icon,
      platform: _platform,
      style: _style,
      showDivider: _showDivider,
      selected: _selected,
      iconSize: _iconSize
    }) => (
      <RN.View>
        <RN.Text testID="vault-row-title">{title}</RN.Text>
        <RN.Text testID="vault-row-subtitle">{subtitle}</RN.Text>
        {icon}
        <RN.TouchableOpacity
          testID="vault-row-listitem-press"
          onPress={onClick}
        >
          <RN.Text>RowPress</RN.Text>
        </RN.TouchableOpacity>
        {rightElement}
      </RN.View>
    ),
    rawTokens: {
      spacing4: 4,
      spacing16: 16,
      radius8: 8
    },
    useTheme: () => ({
      theme: {
        colors: {
          colorPrimary: '#112233',
          colorTextPrimary: '#010203',
          colorBorderSecondary: '#ccc'
        }
      }
    })
  }
})

const defaultVaultActions = {
  onRename: jest.fn(),
  onViewPairedDevices: jest.fn(),
  onSetPassword: jest.fn(),
  onDelete: jest.fn()
}

const renderRow = (props = {}) =>
  render(
    <I18nProvider i18n={i18n}>
      <VaultRow
        vault={{ id: 'v1', name: 'Work Vault' }}
        showDivider={false}
        onAddMember={jest.fn()}
        vaultActions={defaultVaultActions}
        isCurrentVault={false}
        onClick={jest.fn()}
        {...props}
      />
    </I18nProvider>
  )

describe('VaultRow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders vault name as title', () => {
    const { getByTestId } = renderRow({
      vault: { id: 'v1', name: 'Personal' }
    })

    expect(getByTestId('vault-row-title').props.children).toBe('Personal')
  })

  it('falls back to vault id when name is missing', () => {
    const { getByTestId } = renderRow({
      vault: { id: 'only-id' }
    })

    expect(getByTestId('vault-row-title').props.children).toBe('only-id')
  })

  it('calls onClick when list row is pressed', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderRow({ onClick })

    fireEvent.press(getByTestId('vault-row-listitem-press'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render add-member button or actions menu when not current vault', () => {
    const { queryByTestId } = renderRow({ isCurrentVault: false })

    expect(queryByTestId('vault-row-add-member')).toBeNull()
    expect(queryByTestId('vault-actions-menu')).toBeNull()
  })

  it('renders add-member button and actions menu for current vault', () => {
    const { getByTestId } = renderRow({ isCurrentVault: true })

    expect(getByTestId('vault-row-add-member')).toBeTruthy()
    expect(getByTestId('vault-actions-menu')).toBeTruthy()
  })

  it('calls onAddMember when add-member button is pressed', () => {
    const onAddMember = jest.fn()
    const { getByTestId } = renderRow({
      isCurrentVault: true,
      onAddMember
    })

    fireEvent.press(getByTestId('vault-row-add-member'))

    expect(onAddMember).toHaveBeenCalledTimes(1)
  })
})
