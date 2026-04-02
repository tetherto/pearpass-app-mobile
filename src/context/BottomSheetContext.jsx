import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'

import { BackDrop } from '../components/BottomSheetBackdrop'

const BottomSheetContext = createContext()

export const BottomSheetProvider = ({
  children,
  enableContentPanningGesture = true
}) => {
  const bottomSheetRef = useRef(null)
  const { theme } = useTheme()

  const [options, setOptions] = useState(null)
  const snapPoints = useMemo(() => options?.snapPoints || [0], [options])

  const collapseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleClose = useCallback(() => {
    setOptions(null)
  }, [])

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
    [options, collapseBottomSheet]
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
          onClose={handleClose}
          backgroundStyle={{
            backgroundColor: theme.colors.colorSurfacePrimary,
            borderTopLeftRadius: rawTokens.spacing16,
            borderTopRightRadius: rawTokens.spacing16,
            overflow: 'hidden',
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: theme.colors.colorSurfaceDisabled
          }}
        >
          <BottomSheetView style={{ bottom: 0 }}>
            {options.children}
          </BottomSheetView>
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheet = () => useContext(BottomSheetContext)
