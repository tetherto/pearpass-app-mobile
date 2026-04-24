import { useEffect } from 'react'

import { ResizeMode, Video } from 'expo-av'
import { StyleSheet } from 'react-native'

/**
 * @param {Object} props - Component props.
 * @param {() => void} props.onStart - Callback invoked immediately after playback starts.
 * @param {() => void} props.onEnded - Callback invoked after 3000 ms (simulated completion).
 */
export const InitialVideo = ({ onStart, onEnded }) => {
  useEffect(() => {
    onStart()

    const timer = setTimeout(() => {
      onEnded()
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [onEnded, onStart])

  return (
    <Video
      style={styles.logoVideo}
      source={require('../../../assets/videos/second_lock.mp4')}
      shouldPlay
      isLooping={false}
      isMuted={false}
      volume={1.0}
      useNativeControls={false}
      resizeMode={ResizeMode.CONTAIN}
    />
  )
}

const styles = StyleSheet.create({
  logoVideo: {
    width: '80%',
    maxWidth: 282,
    aspectRatio: 1
  }
})
