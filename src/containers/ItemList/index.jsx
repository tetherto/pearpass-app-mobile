import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'
import { KebabMenuIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { formatOtpCode } from '@tetherto/pearpass-lib-vault'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

import { styles } from './styles'
import { AvatarRecord } from '../../components/AvatarRecord'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { CopyButton } from '../../libComponents/CopyButton'
import { BottomSheetRecordActionsContent } from '../BottomSheetRecordActionsContent'

export const ItemList = ({
  records = [],
  isMultiSelectOn,
  selectedRecords,
  setSelectedRecords
}) => {
  const navigation = useNavigation()

  const { expand } = useBottomSheet()

  const isRecordSelected = useCallback(
    (recordId) => selectedRecords.includes(recordId),
    [selectedRecords]
  )

  const handleRecordPress = (recordId) => {
    if (isMultiSelectOn) {
      setSelectedRecords((prevRecords) => {
        if (prevRecords.includes(recordId)) {
          return prevRecords.filter((id) => id !== recordId)
        } else {
          return [...prevRecords, recordId]
        }
      })
    } else {
      navigation.navigate('RecordDetails', {
        recordId: recordId
      })
    }
  }

  return (
    <FlatList
      style={styles.container}
      data={records}
      keyExtractor={(item) => item.id}
      extraData={selectedRecords}
      renderItem={({ item: record }) => {
        const isSelected = isRecordSelected(record.id)
        const websiteDomain =
          record.type === 'login' ? record?.data?.websites?.[0] : null
        return (
          <TouchableOpacity
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => handleRecordPress(record.id)}
            accessible={false}
          >
            <View style={styles.itemRow}>
              <AvatarRecord
                websiteDomain={websiteDomain}
                isSelected={isSelected}
                record={record}
              />

              <View style={styles.itemTextContainer}>
                <Text
                  style={styles.itemText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  accessible
                >
                  {record.data?.title}
                </Text>
                <Text
                  style={styles.itemSubText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {record.folder}
                </Text>
              </View>

              {record?.otpPublic?.currentCode && (
                <>
                  <Text style={styles.itemOtpCode}>
                    {formatOtpCode(record.otpPublic.currentCode)}
                  </Text>
                  <CopyButton value={record.otpPublic.currentCode} />
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={() =>
                expand({
                  children: (
                    <BottomSheetRecordActionsContent
                      record={record}
                      recordType={record.type}
                      excludeTypes={['move']}
                    />
                  ),
                  snapPoints: ['10%', '35%', '35%']
                })
              }
            >
              <KebabMenuIcon size={21} />
            </TouchableOpacity>
          </TouchableOpacity>
        )
      }}
    />
  )
}
