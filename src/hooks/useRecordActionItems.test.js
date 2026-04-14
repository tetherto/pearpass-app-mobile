import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { renderHook } from '@testing-library/react-native'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'

import { useRecordActionItems } from './useRecordActionItems'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({ t: (text) => text })
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn()
  })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => {
  const deleteRecordsMock = jest.fn(() => Promise.resolve())

  return {
    RECORD_TYPES: {
      CREDIT_CARD: 'CREDIT_CARD',
      IDENTITY: 'IDENTITY',
      LOGIN: 'LOGIN',
      NOTE: 'NOTE',
      CUSTOM: 'CUSTOM',
      WIFI_PASSWORD: 'WIFI_PASSWORD'
    },

    useRecords: () => ({
      updateFavoriteState: jest.fn(),
      updateFolder: jest.fn(() => Promise.resolve()),
      deleteRecords: deleteRecordsMock
    })
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit', () => ({
  useBottomSheetClose: () => jest.fn()
}))

jest.mock('./useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copyToClipboard: jest.fn()
  })
}))

jest.mock('../context/BottomSheetContext', () => ({
  useBottomSheet: () => ({
    collapse: jest.fn(),
    expand: jest.fn()
  })
}))

jest.mock('../context/ModalContext', () => ({
  useModal: () => ({
    openModal: jest.fn(),
    closeModal: jest.fn()
  })
}))

jest.mock('../context/SharedFilterContext', () => ({
  useSharedFilter: () => ({
    setState: jest.fn()
  })
}))

jest.mock('@gorhom/bottom-sheet', () => {
  const MockBottomSheet = ({ children }) => <div>{children}</div>
  MockBottomSheet.displayName = 'BottomSheet'
  return {
    __esModule: true,
    default: (props) => <div testID="bottom-sheet">{props.children}</div>
  }
})

describe('useRecordActionItems', () => {
  const mockRecord = {
    id: '123',
    type: RECORD_TYPES.LOGIN,
    isFavorite: false,
    folder: 'Personal',
    data: {
      username: 'testuser',
      password: 'Password!23',
      name: 'Test Card',
      number: '1234567890',
      fullName: 'Test User',
      email: 'test@example.com',
      note: 'This is a test note'
    }
  }

  it('should return actions, recordListActions and recordSortActions', () => {
    const { result } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: mockRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    expect(result.current.actions).toBeDefined()
    expect(result.current.recordListActions).toBeDefined()
    expect(result.current.recordSortActions).toBeDefined()
  })

  it('should filter actions based on excludeTypes', () => {
    const { result } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: mockRecord,
          excludeTypes: ['delete', 'edit']
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const hasDeleteAction = result.current.actions.some(
      (action) => action.type === 'delete'
    )
    const hasEditAction = result.current.actions.some(
      (action) => action.type === 'edit'
    )

    expect(hasDeleteAction).toBe(false)
    expect(hasEditAction).toBe(false)
  })

  it('should return correct copy actions based on recordType', () => {
    const { result: loginResult } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: mockRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const { result: noteResult } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.NOTE,
          record: mockRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const loginCopyActions = loginResult.current.actions.filter(
      (action) => action.type === 'copy'
    )
    const noteCopyActions = noteResult.current.actions.filter(
      (action) => action.type === 'copy'
    )

    expect(loginCopyActions.length).toBe(2)
    expect(noteCopyActions.length).toBe(1)
  })

  it('should include favorite action with correct label based on record state', () => {
    const { result: nonFavoriteResult } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: mockRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const favoriteAction = nonFavoriteResult.current.actions.find(
      (action) => action.type === 'favorite'
    )
    expect(favoriteAction.name).toBe('Add to Favorites')

    const favoriteRecord = { ...mockRecord, isFavorite: true }
    const { result: favoriteResult } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: favoriteRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const removeFavoriteAction = favoriteResult.current.actions.find(
      (action) => action.type === 'favorite'
    )
    expect(removeFavoriteAction.name).toBe('Remove from Favorites')
  })

  it('should return default actions when no recordType is provided', () => {
    const { result } = renderHook(
      () =>
        useRecordActionItems({
          record: mockRecord
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    expect(result.current.actions.length).toBe(4)
  })

  it('should handle delete action correctly', () => {
    const onDeleteMock = jest.fn()
    const { result } = renderHook(
      () =>
        useRecordActionItems({
          recordType: RECORD_TYPES.LOGIN,
          record: mockRecord,
          onDelete: onDeleteMock
        }),
      {
        wrapper: ({ children }) => (
          <I18nProvider i18n={i18n}>{children}</I18nProvider>
        )
      }
    )

    const deleteAction = result.current.actions.find(
      (action) => action.type === 'delete'
    )
    expect(deleteAction).toBeDefined()
    expect(deleteAction.name).toBe('Delete element')

    expect(typeof deleteAction.click).toBe('function')
  })

  it('should return correct sort actions', () => {
    const { result } = renderHook(() => useRecordActionItems(), {
      wrapper: ({ children }) => (
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
      )
    })

    expect(result.current.recordSortActions.length).toBe(3)
    expect(result.current.recordSortActions[0].name).toBe(
      'Last Updated (Newest first)'
    )
    expect(result.current.recordSortActions[1].name).toBe(
      'Last Updated (Oldest first)'
    )
    expect(result.current.recordSortActions[2].name).toBe('Title (A-Z)')
  })

  describe('WiFi Password Record Actions', () => {
    const wifiPasswordRecord = {
      id: 'wifi-123',
      type: RECORD_TYPES.WIFI_PASSWORD,
      isFavorite: false,
      folder: 'Personal',
      data: {
        ssid: 'MyHomeWiFi',
        password: 'SecurePassword123!',
        encryptionType: 'WPA2',
        isHidden: false
      }
    }

    it('should return only default actions for WiFi password records', () => {
      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      expect(result.current.actions).toBeDefined()
      expect(result.current.actions.length).toBe(5)

      const actionTypes = result.current.actions.map((action) => action.type)
      expect(actionTypes).toEqual([
        'copy',
        'move',
        'favorite',
        'edit',
        'delete'
      ])
    })

    it('should handle favorite action correctly for WiFi password records', () => {
      const { result: nonFavoriteResult } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const favoriteAction = nonFavoriteResult.current.actions.find(
        (action) => action.type === 'favorite'
      )
      expect(favoriteAction.name).toBe('Add to Favorites')

      const favoriteWifiRecord = { ...wifiPasswordRecord, isFavorite: true }
      const { result: favoriteResult } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: favoriteWifiRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const removeFavoriteAction = favoriteResult.current.actions.find(
        (action) => action.type === 'favorite'
      )
      expect(removeFavoriteAction.name).toBe('Remove from Favorites')
    })

    it('should handle delete action correctly for WiFi password records', () => {
      const onDeleteMock = jest.fn()
      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord,
            onDelete: onDeleteMock
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const deleteAction = result.current.actions.find(
        (action) => action.type === 'delete'
      )
      expect(deleteAction).toBeDefined()
      expect(deleteAction.name).toBe('Delete element')
      expect(typeof deleteAction.click).toBe('function')
    })

    it('should handle move action correctly for WiFi password records', () => {
      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const moveAction = result.current.actions.find(
        (action) => action.type === 'move'
      )
      expect(moveAction).toBeDefined()
      expect(moveAction.name).toBe('Move to another folder')
      expect(typeof moveAction.click).toBe('function')
    })

    it('should handle edit action correctly for WiFi password records', () => {
      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const editAction = result.current.actions.find(
        (action) => action.type === 'edit'
      )
      expect(editAction).toBeDefined()
      expect(editAction.name).toBe('Edit')
      expect(typeof editAction.click).toBe('function')
    })

    it('should filter actions correctly for WiFi password records with excludeTypes', () => {
      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: wifiPasswordRecord,
            excludeTypes: ['delete', 'edit']
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      const hasDeleteAction = result.current.actions.some(
        (action) => action.type === 'delete'
      )
      const hasEditAction = result.current.actions.some(
        (action) => action.type === 'edit'
      )

      expect(hasDeleteAction).toBe(false)
      expect(hasEditAction).toBe(false)
      expect(result.current.actions.length).toBe(3)
    })

    it('should handle WiFi password records with missing data gracefully', () => {
      const incompleteWifiRecord = {
        ...wifiPasswordRecord,
        data: {
          ssid: 'TestWiFi'
          // Missing password and other fields
        }
      }

      const { result } = renderHook(
        () =>
          useRecordActionItems({
            recordType: RECORD_TYPES.WIFI_PASSWORD,
            record: incompleteWifiRecord
          }),
        {
          wrapper: ({ children }) => (
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
          )
        }
      )

      expect(result.current.actions).toBeDefined()
      expect(result.current.actions.length).toBe(5)
    })
  })
})
