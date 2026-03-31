import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'

type ScreenLayoutProps = {
  header?: ReactNode
  children?: ReactNode
  contentStyle?: StyleProp<ViewStyle>
}

export const ScreenLayout = ({ header, children, contentStyle }: ScreenLayoutProps) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.colorSurfacePrimary }]}>
      {header}

      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: rawTokens.spacing16,
  }
})
