import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  BackIcon,
  BrushIcon,
  FolderIcon,
  KebabMenuIcon,
  StarIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useRecordById, useRecords } from '@tetherto/pearpass-lib-vault'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'
import { TouchableOpacity } from 'react-native'

import { RecordDetailsContent } from './RecordDetailsContentWrapper'
import {
  Container,
  Folder,
  FolderName,
  Header,
  HeaderActions,
  Record,
  RecordForm,
  RecordInfo,
  ScrollContainer,
  ScrollView,
  Title
} from './styles'
import { AvatarRecord } from '../../../components/AvatarRecord'
import { BottomSheetRecordActionsContent } from '../../../containers/BottomSheetRecordActionsContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useHapticFeedback } from '../../../hooks/useHapticFeedback'
import { ButtonLittle } from '../../../libComponents'

export const RecordDetailsV1 = ({ route }) => {
  const { recordId } = route.params
  const { expand } = useBottomSheet()
  const { data: record } = useRecordById({
    variables: {
      id: recordId
    }
  })

  const { updateFavoriteState } = useRecords()

  const { hapticButtonSecondary } = useHapticFeedback()
  const { t } = useLingui()

  const navigation = useNavigation()

  const [isFavorite, setIsFavorite] = useState(record?.isFavorite ?? false)

  useEffect(() => {
    setIsFavorite(record?.isFavorite ?? false)
  }, [record?.isFavorite])

  const websiteDomain =
    record?.type === RECORD_TYPES.LOGIN ? record?.data?.websites?.[0] : null

  if (!record) {
    return <Container />
  }

  return (
    <Container>
      <Header>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />

        <HeaderActions>
          <TouchableOpacity
            onPress={() => {
              hapticButtonSecondary()
              const newFavoriteValue = !isFavorite
              setIsFavorite(newFavoriteValue)
              updateFavoriteState([record?.id], newFavoriteValue)
            }}
          >
            <StarIcon
              size="30"
              color={colors.primary400.mode1}
              fill={isFavorite}
            />
          </TouchableOpacity>

          <ButtonLittle
            startIcon={BrushIcon}
            onPress={() =>
              navigation.navigate('CreateRecord', {
                record: record,
                recordType: record.type,
                selectedFolder: record.folder
              })
            }
          >
            {t`Edit`}
          </ButtonLittle>

          <ButtonLittle
            startIcon={KebabMenuIcon}
            disableHaptics
            onPress={() =>
              expand({
                children: (
                  <BottomSheetRecordActionsContent
                    record={record}
                    recordType={record.type}
                    excludeTypes={['copy', 'edit']}
                    onDelete={() => navigation.goBack()}
                  />
                ),
                snapPoints: ['10%', '25%', '25%']
              })
            }
            variant="secondary"
            borderRadius="md"
          />
        </HeaderActions>
      </Header>

      <Record>
        <AvatarRecord
          websiteDomain={websiteDomain}
          record={record}
          size="md"
          isFavorite={isFavorite}
        />
        <RecordInfo>
          <Title numberOfLines={1} ellipsizeMode="tail">
            {record?.data?.title}
          </Title>

          {!!record?.folder?.length && (
            <Folder>
              <FolderIcon />
              <FolderName numberOfLines={1} ellipsizeMode="tail">
                {record?.folder}
              </FolderName>
            </Folder>
          )}
        </RecordInfo>
      </Record>

      <ScrollContainer>
        <ScrollView>
          <RecordForm>
            <RecordDetailsContent
              record={record}
              selectedFolder={record?.folder}
            />
          </RecordForm>
        </ScrollView>
      </ScrollContainer>
    </Container>
  )
}
