import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { getTimerColor } from '../../components/OtpCodeField/utils'

export const Container = styled(SafeAreaView)`
  flex: 1;
  padding: 8px 16px 0;
  background-color: ${({ theme }) => theme.colors.grey500.mode1};
`

export const EmptyStateContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0px 32px;
`

export const EmptyStateTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white.mode1};
`

export const EmptyStateText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grey100.mode1};
  text-align: center;
`

export const GroupHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 6px;
`

export const GroupLabelText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white.mode1};
`

export const GroupTimeValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, $expiring }) => getTimerColor(theme, $expiring)};
`

export const GroupDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.grey100.mode1}33;
  margin: 8px 16px 0px;
`

export const RecordItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
`

export const RecordTextContainer = styled.View`
  flex: 1;
`

export const RecordTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white.mode1};
`

export const RecordSubText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.grey100.mode1};
  margin-top: 2px;
`

export const OtpCode = styled.Text`
  font-size: 16px;
  font-weight: 600;
  font-family: inter;
  color: ${({ theme }) => theme.colors.white.mode1};
  letter-spacing: 1px;
`
