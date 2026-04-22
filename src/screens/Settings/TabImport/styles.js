import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  gap: 15px;
`

export const Description = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.colors.white.mode1};
  font-family: 'Inter';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`

export const ImportOptionsList = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 20px;
`

export const ImportOptionItem = styled.TouchableOpacity`
  display: flex;
  width: 48%;
  max-width: 140px;
  height: 100px;
  padding: 14px 0px;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.grey100.mode1};
`

export const ImportOptionImage = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`

export const AcceptedFormats = styled.Text`
  color: ${({ theme }) => theme.colors.grey100.mode1};
  font-family: 'Inter';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`
