import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import styled from 'styled-components/native'

export const InputWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 15px;
  width: 100%;
  position: relative;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ isFocused, theme }) =>
    isFocused ? theme.colors.primary400.mode1 : theme.colors.grey100.mode1};
  padding: ${({ isPassword }) => (isPassword ? '5px 10px' : '10px 10px')};
  background-color: 'transparent';
`

export const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.grey100.mode1
})`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 400;
`

export const IconWrapper = styled.View`
  flex-shrink: 0;
`

export const MainWrapper = styled.View`
  flex: 1;
  flex-direction: column;
`

export const ErrorMessageWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
`

export const ErrorMessage = styled.Text`
  color: ${({ theme }) => theme.colors.errorRed.dark};
  font-family: 'Inter';
  font-size: 10px;
  font-weight: 500;
`

export const AdditionalItems = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  align-self: center;
`
