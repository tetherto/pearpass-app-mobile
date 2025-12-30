import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
`

export const Description = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 12px;
  font-weight: 300;
  margin-top: 5px;
`

export const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const SettingLabel = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 700;
`

export const TimeoutSelector = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.grey400.mode1};
  border-radius: 8px;
  margin-top: 8px;
`

export const TimeoutText = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 700;
`
