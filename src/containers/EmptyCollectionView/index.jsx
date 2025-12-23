import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { RECORD_TYPES } from 'pearpass-lib-vault'

import {
  CaptionsContainer,
  Container,
  OptionsContainer,
  ScrollWrapper,
  SubTitle,
  Title
} from './styles'
import { RECORD_ICON_BY_TYPE } from '../../constants/recordIconByType'
import { ButtonCreate } from '../../libComponents'
const {
  LOGIN,
  IDENTITY,
  CREDIT_CARD,
  NOTE,
  CUSTOM,
  WIFI_PASSWORD,
  PASS_PHRASE
} = RECORD_TYPES
/**
 * @param {{
 *  selectedRecordType: 'login' | 'identity' | 'creditCard' | 'note' | 'custom' | 'passPhrase' | 'wifiPassword'
 * }} props
 */
export const EmptyCollectionView = ({ selectedRecordType }) => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const createCollectionOptions = useMemo(
    () =>
      [
        { text: t`Create a login`, type: LOGIN },
        { text: t`Create an identity`, type: IDENTITY },
        {
          text: t`Create a credit card`,
          type: CREDIT_CARD
        },
        { text: t`Create a Wi-Fi password`, type: WIFI_PASSWORD },
        { text: t`Save a Recovery phrase`, type: PASS_PHRASE },
        { text: t`Create a note`, type: NOTE },
        { text: t`Create a custom element`, type: CUSTOM }
      ].filter(
        (option) =>
          selectedRecordType === 'all' || option.type === selectedRecordType
      ),
    [selectedRecordType, t]
  )

  const handlePress = (type) => {
    navigation.navigate('CreateRecord', {
      recordType: type
    })
  }

  return (
    <ScrollWrapper>
      <Container>
        <CaptionsContainer>
          <Title>{t`This collection is empty.`}</Title>

          <SubTitle>{t`Create a new item`}</SubTitle>
        </CaptionsContainer>

        <OptionsContainer>
          {createCollectionOptions.map((option) => (
            <ButtonCreate
              key={option.type}
              onPress={() => handlePress(option.type)}
              startIcon={RECORD_ICON_BY_TYPE[option.type]}
            >
              {option.text}
            </ButtonCreate>
          ))}
        </OptionsContainer>
      </Container>
    </ScrollWrapper>
  )
}
