import styled from 'styled-components/native'

export const ReportProblemContainer = styled.View`
  gap: 15px;
`

export const Version = styled.Text`
  font-family: 'Inter';
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white.mode1};
  font-weight: 600;
  line-height: 16px;
  margin-top: 10px;
`
