import { useCallback, useRef } from 'react'

import type { LayoutChangeEvent } from 'react-native'
import type { ScrollView } from 'react-native-gesture-handler'

/**
 * A target to scroll to, in priority order. The first target whose `hasError`
 * is true and whose anchor has been measured wins.
 */
export type ScrollErrorTarget = {
  hasError: boolean
  /** Anchor key matching the one passed to `registerAnchor`. */
  key: string
}

const SCROLL_TOP_OFFSET = 16

/**
 * Auto-scrolls a `Layout scrollable` form to the first field/section with a
 * validation error on save.
 *
 * Usage:
 *   const { scrollRef, registerAnchor, scrollToFirstError } = useScrollToError()
 *   <Layout scrollable scrollViewRef={scrollRef} ... />
 *   <View onLayout={registerAnchor('email')}>...</View>
 *   // on save: scrollToFirstError([{ hasError: !!errors.title, key: 'title' }, ...])
 */
export const useScrollToError = () => {
  const scrollRef = useRef<ScrollView>(null)
  const anchors = useRef<Record<string, number>>({})

  const registerAnchor = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      anchors.current[key] = event.nativeEvent.layout.y
    },
    []
  )

  const scrollToFirstError = useCallback((targets: ScrollErrorTarget[]) => {
    const target = targets.find(
      (item) => item.hasError && anchors.current[item.key] != null
    )

    if (!target) {
      return
    }

    scrollRef.current?.scrollTo?.({
      y: Math.max(anchors.current[target.key] - SCROLL_TOP_OFFSET, 0),
      animated: true
    })
  }, [])

  return { scrollRef, registerAnchor, scrollToFirstError }
}
