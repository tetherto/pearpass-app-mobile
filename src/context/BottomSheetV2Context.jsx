import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { View, useWindowDimensions } from 'react-native'

import { BottomSheetContext } from './BottomSheetContext'
import { BackDrop } from '../components/BottomSheetBackdrop'

const BottomSheetV2Context = createContext()

export const BottomSheetV2Provider = ({ children }) => {
  const ref = useRef(null)
  const { theme } = useTheme()
  const { height: screenHeight } = useWindowDimensions()
  const [content, setContent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [snapPoints, setSnapPoints] = useState([1])
  const pendingOpen = useRef(false)
  const pendingSnap = useRef(null)

  const collapse = useCallback(() => {
    ref.current?.close()
  }, [])

  const expand = useCallback(({ children: sheetContent }) => {
    pendingOpen.current = true
    setContent(sheetContent)
  }, [])

  const handleContentLayout = useCallback(
    (e) => {
      const height = e.nativeEvent.layout.height
      if (height <= 0 || !pendingOpen.current) return
      pendingOpen.current = false
      const capped = Math.min(height, screenHeight * 0.75)
      pendingSnap.current = capped
      setSnapPoints([capped])
    },
    [screenHeight]
  )

  useEffect(() => {
    if (pendingSnap.current !== null) {
      pendingSnap.current = null
      setIsOpen(true)
      requestAnimationFrame(() => {
        ref.current?.snapToIndex(0)
      })
    }
  }, [snapPoints])

  const ctx = useMemo(() => ({ expand, collapse }), [expand, collapse])

  const renderBackdrop = useCallback(
    () => <BackDrop activeOpacity={1} onPress={collapse} visible={isOpen} />,
    [isOpen, collapse]
  )

  return (
    <BottomSheetV2Context.Provider value={ctx}>
      <BottomSheetContext.Provider value={ctx}>
        {children}
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={snapPoints}
          handleComponent={null}
          backdropComponent={renderBackdrop}
          onClose={() => {
            pendingOpen.current = false
            pendingSnap.current = null
            setIsOpen(false)
            setContent(null)
            setSnapPoints([1])
          }}
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
          <BottomSheetView>
            <View onLayout={handleContentLayout}>{content}</View>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetContext.Provider>
    </BottomSheetV2Context.Provider>
  )
}

export const useBottomSheetV2 = () => useContext(BottomSheetV2Context)
