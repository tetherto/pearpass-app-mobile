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
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { BackDrop } from '../components/BottomSheetBackdrop'
import { isV2 } from '../utils/designVersion'

export const BottomSheetContext = createContext()

export const BottomSheetProvider = ({
  children,
  enableContentPanningGesture = true
}) => {
  const bottomSheetRef = useRef(null)
  const { theme } = useTheme()

  const [options, setOptions] = useState(null)
  const snapPoints = useMemo(() => options?.snapPoints || [0], [options])

  // Original V1 behavior: collapse = setOptions(null) (synchronous).
  // This allows collapse() + expand() to batch in a single React render,
  // so expand() always wins and the new sheet content is shown correctly.
  const collapseBottomSheet = useCallback(() => setOptions(null), [])

  useEffect(() => {
    if (!options) {
      bottomSheetRef?.current?.collapse()
    }
  }, [options])

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
    () => <BackDrop animatedOpacity={1} onPress={collapseBottomSheet} />,
    [collapseBottomSheet]
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
            backgroundColor: isV2()
              ? theme.colors.colorSurfacePrimary
              : colors.grey500.mode1,
            borderTopLeftRadius: rawTokens.spacing16,
            borderTopRightRadius: rawTokens.spacing16,
            overflow: 'hidden',
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: isV2()
              ? theme.colors.colorSurfaceDisabled
              : colors.primary100.mode1
          }}
        >
          {options.children}
        </BottomSheet>
      )}
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheet = () => useContext(BottomSheetContext)
