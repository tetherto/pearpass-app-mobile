import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { getTimerColor } from './utils'

export const NextCodeButton = styled(TouchableOpacity)`
  padding: 4px 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey100.mode1};
  border-radius: 6px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const NextCodeButtonText = styled.Text`
  font-family: inter;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white.mode1};
`

export const TimerBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 6px;
`

export const TimerBarTrack = styled.View`
  flex: 1;
  height: 6px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.grey100.mode1}33;
  overflow: hidden;
`

export const TimerText = styled.Text`
  font-family: inter;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme, $expiring }) => getTimerColor(theme, $expiring)};
  min-width: 22px;
  text-align: right;
`
