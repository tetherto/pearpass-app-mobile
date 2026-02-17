import styled from 'styled-components/native'

export const Container = styled.View`
  padding-top: 25px;
  padding-bottom: 25px;
  gap: 20px;
  align-items: center;
  align-self: center;
`

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  text-align: center;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
`
