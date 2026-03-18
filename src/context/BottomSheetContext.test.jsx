import { render, act } from '@testing-library/react-native'

import { BottomSheetProvider, useBottomSheet } from './BottomSheetContext'

jest.mock('@gorhom/bottom-sheet', () => {
  const MockBottomSheet = ({ children }) => <div>{children}</div>
  MockBottomSheet.displayName = 'BottomSheet'
  return {
    __esModule: true,
    default: (props) => <div testID="bottom-sheet">{props.children}</div>
  }
})

jest.mock('../components/BottomSheetBackdrop', () => ({
  BackDrop: () => <div testID="backdrop" />
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    grey500: { mode1: '#333333' },
    primary100: { mode1: '#cccccc' }
  }
}))

describe('BottomSheetContext', () => {
  const TestComponent = () => {
    const { expand, collapse } = useBottomSheet()

    return (
      <div>
        <button
          testID="expand-button"
          onPress={() =>
            expand({
              snapPoints: ['25%', '50%'],
              children: <div testID="content">Test Content</div>
            })
          }
        />
        <button testID="collapse-button" onPress={collapse} />
      </div>
    )
  }

  it('should not render bottom sheet when options is null', () => {
    const { queryByTestId } = render(
      <BottomSheetProvider>
        <TestComponent />
      </BottomSheetProvider>
    )

    expect(queryByTestId('bottom-sheet')).toBeNull()
  })

  it('should collapse bottom sheet when options is set to null', () => {
    const { getByTestId, queryByTestId } = render(
      <BottomSheetProvider>
        <TestComponent />
      </BottomSheetProvider>
    )

    expect(queryByTestId('bottom-sheet')).toBeNull()

    act(() => {
      getByTestId('expand-button').props.onPress()
    })

    expect(queryByTestId('content')).not.toBeNull()

    act(() => {
      getByTestId('collapse-button').props.onPress()
    })

    expect(queryByTestId('bottom-sheet')).toBeNull()
  })
})
