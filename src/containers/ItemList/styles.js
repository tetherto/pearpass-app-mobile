import styled from 'styled-components/native'

export const Container = styled.FlatList`
  flex: 1;
`

export const Item = styled.TouchableOpacity`
  flex-direction: row;
  padding: 12px 10px;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(186, 222, 91, 0.20)' : 'transparent'};
`

export const ItemRow = styled.View`
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

export const ItemTextContainer = styled.View`
  flex: 1;
  padding-left: 8px;
`

export const ItemText = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail'
})`
  color: #fff;
  font-size: 16px;
  font-family: 'Inter';
`

export const ItemSubText = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail'
})`
  color: ${({ theme }) => theme.colors.grey100.mode1};
  font-size: 12px;
  font-family: 'Inter';
`

export const ItemOtpCode = styled.Text`
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter';
  color: ${({ theme }) => theme.colors.white.mode1};
  letter-spacing: 1px;
`
