import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  padding-top: 64px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.grey500.mode1};
`
export const Header = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const HeaderActions = styled.View`
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const Record = styled.View`
  flex-direction: row;
  gap: 15px;
  padding-bottom: 16px;
`

export const RecordInfo = styled.View`
  flex: 1;
  justify-content: center;
  gap: 8px;
`
export const Title = styled.Text`
  font-family: 'Inter';
  font-size: 32px;
  font-weight: 700;
  color: #fff;
`
export const Folder = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

export const FolderName = styled.Text`
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.grey100.mode1};
  flex-shrink: 1;
`
export const RecordForm = styled.View`
  gap: 15px;
  flex: 1;
`

export const ScrollContainer = styled.View`
  flex: 1;
`

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 }
})`
  flex: 1;
`
