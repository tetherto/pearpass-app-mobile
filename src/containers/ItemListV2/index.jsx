import { useCallback, useMemo, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { ExpandMore, StarOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, SectionList, View } from 'react-native'

import { createStyles } from './styles'
import { VaultListItem } from './VaultListItem'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { BottomSheetRecordActionsContentV2 } from '../BottomSheetRecordActionsContentV2'

const CollapsibleSectionHeader = ({
  section,
  isCollapsed,
  onToggle,
  styles,
  iconColor
}) => (
  <Pressable
    style={styles.sectionHeaderContainer}
    onPress={() => onToggle(section.key)}
  >
    <View
      style={[
        styles.sectionHeaderChevron,
        { transform: [{ rotate: isCollapsed ? '-90deg' : '0deg' }] }
      ]}
    >
      <ExpandMore width={10} height={10} color={iconColor} />
    </View>

    {section.isFavorites && (
      <StarOutlined width={18} height={18} color={iconColor} />
    )}

    <Text variant="labelEmphasized" style={{ color: iconColor }}>
      {section.title}
    </Text>
  </Pressable>
)

export const ItemListV2 = ({
  sections,
  isMultiSelectOn,
  selectedRecords,
  setSelectedRecords,
  setIsMultiSelectOn
}) => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { expand } = useBottomSheet()
  const [collapsedSections, setCollapsedSections] = useState({})
  const styles = createStyles(theme.colors)

  const toggleSection = useCallback((key) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const isRecordSelected = useCallback(
    (recordId) => selectedRecords.includes(recordId),
    [selectedRecords]
  )

  const handleRecordPress = useCallback(
    (recordId) => {
      if (isMultiSelectOn) {
        setSelectedRecords((prev) =>
          prev.includes(recordId)
            ? prev.filter((id) => id !== recordId)
            : [...prev, recordId]
        )
      } else {
        navigation.navigate('RecordDetails', { recordId })
      }
    },
    [isMultiSelectOn, navigation, setSelectedRecords]
  )

  const handleLongPress = useCallback(
    (record) => {
      expand({
        children: (
          <BottomSheetRecordActionsContentV2
            record={record}
            recordType={record.type}
            onSelectItem={() => {
              setIsMultiSelectOn?.(true)
              setSelectedRecords((prev) =>
                prev.includes(record.id) ? prev : [...prev, record.id]
              )
            }}
          />
        ),
        snapPoints: ['10%', '60%', '60%']
      })
    },
    [expand, setIsMultiSelectOn, setSelectedRecords]
  )

  const visibleSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        data: collapsedSections[section.key] ? [] : section.data
      })),
    [sections, collapsedSections]
  )

  return (
    <View style={styles.contentContainer}>
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={styles.sectionListContent}
        sections={visibleSections}
        keyExtractor={(item) => item.id}
        extraData={selectedRecords}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <CollapsibleSectionHeader
            section={section}
            isCollapsed={collapsedSections[section.key]}
            onToggle={toggleSection}
            styles={styles}
            iconColor={theme.colors.colorTextSecondary}
          />
        )}
        renderItem={({ item: record }) => (
          <VaultListItem
            record={record}
            isMultiSelectOn={isMultiSelectOn}
            isSelected={isRecordSelected(record.id)}
            onPress={handleRecordPress}
            onLongPress={handleLongPress}
          />
        )}
        renderSectionFooter={({ section }) => {
          const idx = visibleSections.findIndex((s) => s.key === section.key)
          if (idx === visibleSections.length - 1) return null
          return <View style={styles.divider} />
        }}
      />
      <View style={styles.fadeGradient} pointerEvents="none" />
    </View>
  )
}
