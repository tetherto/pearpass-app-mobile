import { PASSWORD_STRENGTH } from '@tetherto/pearpass-utils-password-check'
import styled from 'styled-components/native'

export const PasswordStrongnessWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
  gap: 5px;
`

export const PasswordText = styled.Text`
  font-family: 'Inter';
  font-size: 8px;
  font-weight: 500;
  color: ${({ theme, strength }) => {
    switch (strength) {
      case PASSWORD_STRENGTH.SAFE:
        return theme.colors.primary400.mode1
      case PASSWORD_STRENGTH.VULNERABLE:
        return theme.colors.errorRed.dark
      case PASSWORD_STRENGTH.WEAK:
        return theme.colors.errorYellow.mode1
      default:
        return theme.colors.white.mode1
    }
  }};
`
