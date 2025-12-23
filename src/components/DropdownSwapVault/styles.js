import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

export const Wrapper = styled.View`
  width: 100%;
  max-width: 400px;
  align-items: center;
`

export const Container = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.black.mode1};
  border-width: 1px;
  border-color: ${({ theme, isOpen }) =>
    isOpen ? theme.colors.primary400.mode1 : 'transparent'};

  z-index: 3;
`

export const ArrowIconWrapper = styled.View`
  margin-left: auto;
`

export const DropdownWrapper = styled(Animated.View)`
  overflow: hidden;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;

  width: 100%;
  background-color: ${({ theme }) => theme.colors.black.mode1};
  margin-top: -10px;
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
`

export const Dropdown = styled.View`
  max-height: 143px;
  width: 100%;
  margin-top: 10px;
`

export const DropdownItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.grey500.mode1};
`

export const DropdownItemText = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-size: 16px;
  font-weight: 700;
`

export const CreateVaultButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 9px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.grey500.mode1};
`

export const CreateVaultText = styled.Text`
  color: ${({ theme }) => theme.colors.primary400.mode1};
  font-size: 14px;
  font-weight: 700;
`
