import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import BottomSheet from '@gorhom/bottom-sheet'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { BackDrop } from '../components/BottomSheetBackdrop'

const BottomSheetContext = createContext()

export const BottomSheetProvider = ({
  children,
  enableContentPanningGesture = true
}) => {
  const bottomSheetRef = useRef(null)

  const [options, setOptions] = useState(null)
  const snapPoints = useMemo(() => options?.snapPoints || [0], [options])

  useEffect(() => {
    if (!options) {
      bottomSheetRef?.current?.collapse()
    }
  }, [options])

  const collapseBottomSheet = useCallback(() => setOptions(null), [])

  const handleSheetchanges = useCallback(
    (index) => {
      if (index === 0) {
        collapseBottomSheet()
      }
    },
    [collapseBottomSheet]
  )

  const bottomSheetContext = useMemo(
    () => ({
      expand: setOptions,
      collapse: collapseBottomSheet
    }),
    [collapseBottomSheet]
  )

  const renderBackdrop = useCallback(
    () => (
      <BackDrop
        activeOpacity={0.3}
        onPress={collapseBottomSheet}
        visible={!!options}
      />
    ),
    [options, bottomSheetRef]
  )

  return (
    <BottomSheetContext.Provider value={bottomSheetContext}>
      {children}
      {options && (
        <BottomSheet
          enableContentPanningGesture={
            options?.enableContentPanningGesture ?? enableContentPanningGesture
          }
          accessible={false}
          ref={bottomSheetRef}
          index={options?.snapPoints?.length - 1}
          snapPoints={snapPoints}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onChange={handleSheetchanges}
          backgroundStyle={{
            backgroundColor: colors.grey500.mode1,
            overflow: 'hidden',
            borderWidth: 1,
            padding: 20,
            borderColor: colors.primary100.mode1
          }}
        >
          {options.children}
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheet = () => useContext(BottomSheetContext)
