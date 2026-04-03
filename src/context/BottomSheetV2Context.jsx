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
import { Animated, View, useWindowDimensions } from 'react-native'

import { BottomSheetContext } from './BottomSheetContext'
import { BackDrop } from '../components/BottomSheetBackdrop'

const BACKDROP_DURATION = 200

const BottomSheetV2Context = createContext()

export const BottomSheetV2Provider = ({ children }) => {
  const ref = useRef(null)
  const { theme } = useTheme()
  const { height: screenHeight } = useWindowDimensions()
  const [content, setContent] = useState(null)
  const [expandCount, setExpandCount] = useState(0)
  const [snapPoints, setSnapPoints] = useState([1])
  const isExpanding = useRef(false)
  const pendingSnap = useRef(false)
  const pendingOpen = useRef(false)
  const backdropAnim = useRef(new Animated.Value(0)).current

  const collapse = useCallback(() => {
    isExpanding.current = false
    pendingOpen.current = false
    Animated.timing(backdropAnim, {
      toValue: 0,
      duration: BACKDROP_DURATION,
      useNativeDriver: true
    }).start()
    ref.current?.close()
  }, [backdropAnim])

  const expand = useCallback(({ children: sheetContent }) => {
    isExpanding.current = true
    setExpandCount((c) => c + 1)
    setContent(sheetContent)
  }, [])

  const handleContentLayout = useCallback(
    (e) => {
      if (!isExpanding.current) return
      const { height } = e.nativeEvent.layout
      if (height <= 0) return
      const capped = Math.min(height, screenHeight * 0.75)
      pendingSnap.current = true
      setSnapPoints([capped])
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: BACKDROP_DURATION,
        useNativeDriver: true
      }).start()
    },
    [screenHeight, backdropAnim]
  )

  useEffect(() => {
    if (!pendingSnap.current || !isExpanding.current) return
    pendingSnap.current = false
    pendingOpen.current = true
    ref.current?.snapToIndex(0)
  }, [snapPoints])

  const handleSheetChange = useCallback((index) => {
    if (index >= 0) {
      pendingOpen.current = false
    } else if (index === -1 && pendingOpen.current && isExpanding.current) {
      pendingOpen.current = false
      ref.current?.snapToIndex(0)
    }
  }, [])

  const ctx = useMemo(() => ({ expand, collapse }), [expand, collapse])

  const renderBackdrop = useCallback(
    () => <BackDrop animatedOpacity={backdropAnim} onPress={collapse} />,
    [backdropAnim, collapse]
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
          onChange={handleSheetChange}
          onClose={() => {
            if (isExpanding.current) return
            pendingOpen.current = false
            backdropAnim.setValue(0)
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
            <View key={expandCount} onLayout={handleContentLayout}>
              {content}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetContext.Provider>
    </BottomSheetV2Context.Provider>
  )
}

export const useBottomSheetV2 = () => useContext(BottomSheetV2Context)
