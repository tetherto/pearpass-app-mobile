import { useCallback, useMemo, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { ListItem, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  ErrorFilled,
  ExpandMore,
  KeyboardArrowRightFilled,
  StarFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, SectionList, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { createStyles } from './styles'
import { RecordItemIcon } from '../../components/RecordItemIcon'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'
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
      <StarFilled width={14} height={14} color={iconColor} />
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

  const selectedRecordsSet = useMemo(
    () => new Set(selectedRecords),
    [selectedRecords]
  )

  const isRecordSelected = useCallback(
    (recordId) => selectedRecordsSet.has(recordId),
    [selectedRecordsSet]
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
        )
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
          <View style={styles.recordItem}>
            <ListItem
              icon={<RecordItemIcon record={record} />}
              iconSize={32}
              title={record.data?.title ?? ''}
              subtitle={getRecordSubtitle(record) || undefined}
              selectionMode={isMultiSelectOn ? 'multi' : 'none'}
              isSelected={isRecordSelected(record.id)}
              onSelect={() => handleRecordPress(record.id)}
              onClick={() => handleRecordPress(record.id)}
              onLongPress={() => handleLongPress(record)}
              rightElement={
                !isMultiSelectOn ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {record.hasSecurityAlert && (
                      <ErrorFilled width={20} height={20} />
                    )}
                    <KeyboardArrowRightFilled
                      width={18}
                      height={18}
                      color={theme.colors.colorTextSecondary}
                    />
                  </View>
                ) : undefined
              }
            />
          </View>
        )}
        renderSectionFooter={({ section }) => {
          const idx = visibleSections.findIndex((s) => s.key === section.key)
          if (idx === visibleSections.length - 1) return null
          return <View style={styles.divider} />
        }}
      />
      <View style={styles.fadeGradient} pointerEvents="none">
        <Svg width="100%" height={70}>
          <Defs>
            <LinearGradient id="fade-bottom" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor={theme.colors.colorSurfacePrimary}
                stopOpacity="0"
              />
              <Stop
                offset="1"
                stopColor={theme.colors.colorSurfacePrimary}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height={70} fill="url(#fade-bottom)" />
        </Svg>
      </View>
    </View>
  )
}
