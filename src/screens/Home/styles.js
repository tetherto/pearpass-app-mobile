import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
export const Container = styled(SafeAreaView)`
  padding: 8px 16px 0;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.grey500.mode1};
`

export const CurrentFolder = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

export const FolderName = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail'
})`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 400;
  flex: 1;
`
