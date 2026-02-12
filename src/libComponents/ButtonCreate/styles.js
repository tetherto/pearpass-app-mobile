import styled from 'styled-components/native'

export const Button = styled.TouchableOpacity`
  padding: 15px;
  width: 100%;
  flex-direction: row;
  justify-content: ${({ hasIcon }) => (hasIcon ? 'space-between' : 'center')};
  align-items: center;
  align-self: stretch;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grey100.mode1};
  background: ${({ theme }) => theme.colors.primary300.mode1};
`

export const ButtonText = styled.Text`
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black.mode1};
`
