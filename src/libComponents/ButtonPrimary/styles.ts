import styled from 'styled-components/native'
import { TouchableOpacity, Text } from 'react-native'

interface ButtonProps {
  size: 'sm' | 'md'
  stretch?: boolean
  disabled?: boolean
}

interface ButtonTextProps {
  size: 'sm' | 'md'
}

export const Button = styled(TouchableOpacity) <ButtonProps>`
  display: inline-flex;
  padding: ${({ size }) => (size === 'sm' ? '10px 15px' : '10px 40px')};
  align-self: ${({ stretch }) => (stretch ? 'stretch' : 'flex-start')};
  width: ${({ stretch }) => (stretch ? '100%' : 'auto')};
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  border-radius: ${({ size }) => (size === 'sm' ? '10px' : '20px')};
  border-width: ${({ size }) => (size === 'sm' ? '1px' : '2px')};
  border-color: ${({ theme }) => theme.colors.primary400.mode1};
  background: ${({ theme }) => theme.colors.primary400.mode1};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`

export const ButtonText = styled(Text) <ButtonTextProps>`
  color: ${({ theme }) => theme.colors.black.mode1};
  font-family: 'Inter';
  font-size: ${({ size }) => (size === 'sm' ? '12px' : '16px')};
  font-weight: ${({ size }) => (size === 'sm' ? '600' : '500')};
`
