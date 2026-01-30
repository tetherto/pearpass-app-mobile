import styled from 'styled-components/native'

export const Header = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 500;
`

export const ContentWrapper = styled.View`
  padding: 0 20px 20px 20px;
`

export const BottomSheetBody = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.colors.white.mode1};
  font-size: 14px;
  line-height: 22px;
  padding-horizontal: 5px;
`

export const ActionsWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding-top: 20px;
`
