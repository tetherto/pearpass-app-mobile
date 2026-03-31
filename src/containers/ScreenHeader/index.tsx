import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, rawTokens } from '@tetherto/pearpass-lib-ui-kit'

type ScreenHeaderProps = {
  leftSlot?: ReactNode
  centerSlot?: ReactNode
  rightActions?: ReactNode
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

export const ScreenHeader = ({
  leftSlot,
  centerSlot,
  rightActions,
  style,
  contentStyle
}: ScreenHeaderProps) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorBackground,
          paddingTop: insets.top
        },
        style
      ]}
    >
      <View style={[styles.headerContent, contentStyle]}>
        {leftSlot && <View style={styles.leftContainer}>{leftSlot}</View>}

        <View style={styles.centerContainer}>
          {centerSlot}
        </View>

        {rightActions && (
          <View style={styles.rightContainer}>
            {rightActions}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing8,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing16
  }
})
