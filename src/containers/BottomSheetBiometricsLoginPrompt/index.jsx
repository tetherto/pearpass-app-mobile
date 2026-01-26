import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { Text } from 'react-native'

import {
  Header,
  Title,
  ContentWrapper,
  BottomSheetBody,
  ActionsWrapper
} from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { ButtonPrimary, ButtonSecondary } from '../../libComponents'

export const BottomSheetBiometricsLoginPrompt = ({
  onConfirm,
  onDismiss,
  title,
  description
}) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()

  return (
    <BottomSheetView style={{ padding: 20 }}>
      <Header>
        <Title>{title || t`Enable biometric authentication`}</Title>
      </Header>
      <ContentWrapper>
        <BottomSheetBody>
          {description ||
            t`Your device supports biometric authentication. Do you want to enable biometric authentication for easier and more secure sign-in?`}
        </BottomSheetBody>
        <ActionsWrapper>
          <ButtonSecondary
            onPress={() => {
              collapse()
              onDismiss()
            }}
            stretch
          >
            <Text>{t`Dismiss`}</Text>
          </ButtonSecondary>
          <ButtonPrimary
            onPress={() => {
              collapse()
              onConfirm()
            }}
            stretch
          >
            <Text>{t`Enable`}</Text>
          </ButtonPrimary>
        </ActionsWrapper>
      </ContentWrapper>
    </BottomSheetView>
  )
}
