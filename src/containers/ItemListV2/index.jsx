import { useCallback, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  ContextMenu,
  ListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  ErrorFilled,
  ExpandMore,
  StarFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, SectionList, View } from 'react-native'

import { createStyles } from './styles'
import { FadeGradient } from '../../components/FadeGradient'
import { RecordItemIcon } from '../../components/RecordItemIcon'
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
      <ExpandMore width={16} height={16} color={iconColor} />
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
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [collapsedSections, setCollapsedSections] = useState({})
  const [listItemHeight, setListItemHeight] = useState(0)
  const styles = createStyles(theme.colors)

  const sectionTitleMap = useMemo(
    () => ({
      favorites: t`Favorites`,
      all: t`All Items`,
      today: t`Today`,
      yesterday: t`Yesterday`,
      thisWeek: t`This Week`,
      thisMonth: t`This Month`,
      older: t`Older`
    }),
    [t]
  )

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

  const visibleSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        title: sectionTitleMap[section.key] ?? section.title,
        data: collapsedSections[section.key] ? [] : section.data
      })),
    [sections, collapsedSections, sectionTitleMap]
  )

  return (
    <View style={styles.contentContainer}>
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={
          listItemHeight > 0 && { paddingBottom: listItemHeight }
        }
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
        renderItem={({ item: record, index }) => (
          <View
            style={styles.recordItem}
            onLayout={
              index === 0
                ? (e) => setListItemHeight(e.nativeEvent.layout.height)
                : undefined
            }
          >
            <ContextMenu
              openOnLongPress
              trigger={
                <ListItem
                  icon={<RecordItemIcon record={record} />}
                  iconSize={32}
                  title={record.data?.title ?? ''}
                  titleStyle={styles.itemTitle}
                  subtitle={getRecordSubtitle(record) || undefined}
                  subtitleStyle={styles.itemSubtitle}
                  selectionMode={isMultiSelectOn ? 'multi' : 'none'}
                  isSelected={isRecordSelected(record.id)}
                  onSelect={() => handleRecordPress(record.id)}
                  onClick={() => handleRecordPress(record.id)}
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
                        <View style={styles.chevronRight}>
                          <ExpandMore
                            width={20}
                            height={20}
                            color={theme.colors.colorTextSecondary}
                          />
                        </View>
                      </View>
                    ) : undefined
                  }
                />
              }
            >
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
            </ContextMenu>
          </View>
        )}
        renderSectionFooter={({ section }) => {
          if (section.key === visibleSections[visibleSections.length - 1]?.key)
            return null
          return <View style={styles.divider} />
        }}
      />
      <FadeGradient
        color={theme.colors.colorSurfacePrimary}
        style={[styles.fadeGradient, { height: listItemHeight }]}
      />
    </View>
  )
}
