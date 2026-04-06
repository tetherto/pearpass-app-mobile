import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  NavbarListItem,
  rawTokens,
  SearchField,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Devices,
  BugReportFilled,
  SecurityFilled,
  LockOutlined,
  HubFilled,
  SystemSecurityUpdateFilled,
  Key,
  LayerFilled,
  Login,
  Logout,
  PaletteOutlined,
  SettingsApplicationsFilled,
  Sync,
  Translate,
  KeyboardArrowRightFilled,
  InfoOutlined,
  KeyboardArrowBottom
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

import { ScreenHeader } from '../../containers/ScreenHeader'
import { ScreenLayout } from '../../containers/ScreenLayout'

export const SettingsV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  const [expandedSections, setExpandedSections] = useState({})

  const sections = useMemo(
    () => [
      {
        key: 'security',
        title: t`Security`,
        icon: SecurityFilled,
        items: [
          {
            key: 'app-preferences',
            label: t`App Preferences`,
            screen: 'Security',
            icon: SettingsApplicationsFilled
          },
          {
            key: 'master-password',
            label: t`Master Password`,
            screen: 'MasterPassword',
            icon: Key
          }
        ]
      },
      {
        key: 'syncing',
        title: t`Syncing`,
        icon: Sync,
        items: [
          {
            key: 'blind-peering',
            label: t`Blind Peering`,
            screen: 'Syncing',
            icon: HubFilled
          },
          {
            key: 'your-devices',
            label: t`Your Devices`,
            screen: 'Vaults',
            icon: Devices
          }
        ]
      },
      {
        key: 'vault',
        title: t`Vault`,
        icon: LockOutlined,
        items: [
          {
            key: 'your-vaults',
            label: t`Your Vaults`,
            screen: 'Vaults',
            icon: LayerFilled
          },
          {
            key: 'import-items',
            label: t`Import Items`,
            screen: 'Vaults',
            icon: Login
          },
          {
            key: 'export-items',
            label: t`Export Items`,
            screen: 'Vaults',
            icon: Logout
          }
        ]
      },
      {
        key: 'appearance',
        title: t`Appearance`,
        icon: PaletteOutlined,
        items: [
          {
            key: 'language',
            label: t`Language`,
            screen: 'Appearance',
            icon: Translate
          }
        ]
      },
      {
        key: 'about',
        title: t`About`,
        icon: InfoOutlined,
        items: [
          {
            key: 'report-a-problem',
            label: t`Report a problem`,
            screen: 'About',
            icon: BugReportFilled
          },
          {
            key: 'app-version',
            label: t`App Version`,
            screen: 'About',
            icon: SystemSecurityUpdateFilled
          }
        ]
      }
    ],
    [t]
  )

  const normalizedSearchValue = searchValue.trim().toLowerCase()
  const filteredSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.label.toLowerCase().includes(normalizedSearchValue)
          )
        }))
        .filter((section) => section.items.length > 0),
    [normalizedSearchValue, sections]
  )

  const toggleSection = (sectionKey) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionKey]: !(current[sectionKey] ?? true)
    }))
  }

  return (
    <ScreenLayout
      scrollable
      style={{ flex: 1 }}
      contentStyle={styles.scrollContent}
      footerStyle={styles.hiddenFooter}
      containerStyle={{ backgroundColor: theme.colors.colorBackground }}
      header={
        <ScreenHeader
          centerSlot={
            <View style={styles.searchContainer}>
              <SearchField
                value={searchValue}
                size="medium"
                placeholderText={t`Search in Settings`}
                onChangeText={setSearchValue}
              />
            </View>
          }
        />
      }
    >
      {filteredSections.map((section, index) => {
        const SectionIcon = section.icon
        const isExpanded =
          normalizedSearchValue.length > 0 ||
          (expandedSections[section.key] ?? true)
        const DisclosureIcon = isExpanded
          ? KeyboardArrowBottom
          : KeyboardArrowRightFilled

        return (
          <View
            key={section.key}
            style={[
              styles.sectionCard,
              index > 0 && styles.sectionCardWithTopPadding,
              index === filteredSections.length - 1 && { borderBottomWidth: 0 },
              {
                borderBottomColor: theme.colors.colorBorderPrimary
              }
            ]}
          >
            <View style={styles.sectionHeaderItem}>
              <NavbarListItem
                label={section.title}
                size="small"
                icon={
                  <>
                    <DisclosureIcon color={theme.colors.colorTextSecondary} />
                    <SectionIcon color={theme.colors.colorTextPrimary} />
                  </>
                }
                onClick={() => toggleSection(section.key)}
              />
            </View>

            {isExpanded && (
              <View
                style={[
                  styles.itemsTrack,
                  {
                    borderLeftColor: theme.colors.colorBorderPrimary
                  }
                ]}
              >
                {section.items.map((item) => {
                  const ItemIcon = item.icon

                  return (
                    <View key={item.key} style={styles.itemRow}>
                      <View
                        style={[
                          styles.itemAnchor,
                          {
                            borderLeftColor: theme.colors.colorBorderPrimary,
                            borderBottomColor: theme.colors.colorBorderPrimary
                          }
                        ]}
                      />
                      <NavbarListItem
                        label={item.label}
                        variant="secondary"
                        size="big"
                        icon={
                          <ItemIcon color={theme.colors.colorTextSecondary} />
                        }
                        onClick={
                          item.screen
                            ? () => navigation.navigate(item.screen)
                            : undefined
                        }
                      />
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        )
      })}

      {filteredSections.length === 0 && (
        <View style={styles.emptyState}>
          <Text variant="bodyEmphasized">{t`No matching settings`}</Text>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Try another search term.`}
          </Text>
        </View>
      )}
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1
  },
  scrollContent: {
    padding: rawTokens.spacing16
  },
  sectionCard: {
    paddingBottom: rawTokens.spacing8,
    gap: rawTokens.spacing4,
    borderBottomWidth: 1
  },
  sectionCardWithTopPadding: {
    paddingTop: rawTokens.spacing8
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0
  },
  sectionHeaderItem: {
    flex: 1
  },
  itemsTrack: {
    marginLeft: rawTokens.spacing8,
    borderLeftWidth: 1
  },
  itemRow: {
    position: 'relative',
    paddingLeft: rawTokens.spacing12
  },
  itemAnchor: {
    position: 'absolute',
    left: -1,
    top: rawTokens.spacing16,
    width: rawTokens.spacing8,
    height: rawTokens.spacing8,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: rawTokens.spacing8
  },
  emptyState: {
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing8,
    gap: rawTokens.spacing6
  },
  hiddenFooter: {
    display: 'none'
  }
})
