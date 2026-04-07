import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex: 1;
`
export const Header = styled.View`
  z-index: 10;
`

export const ScrollContainer = styled.View`
  flex: 1;
`

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 }
})`
  flex: 1;
`

export const FormWrapper = styled.View`
  gap: 15px;
  min-height: 100%;
`
