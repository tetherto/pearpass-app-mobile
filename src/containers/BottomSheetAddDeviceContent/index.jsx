import { useState } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import {
  ArrowLeftIcon,
  YellowErrorIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { PairAnotherDeviceContent } from './PairAnotherDeviceContent'
import { PairThisDeviceContent } from './PairThisDeviceContent'
import { useBottomSheet } from '../../context/BottomSheetContext'

const TAB = {
  PAIR_THIS: 'pairThis',
  PAIR_ANOTHER: 'pairAnother'
}

export const BottomSheetAddDeviceContent = () => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()

  const [activeTab, setActiveTab] = useState(TAB.PAIR_THIS)
  const [showScanner, setShowScanner] = useState(false)

  const handleBack = () => {
    if (activeTab === TAB.PAIR_ANOTHER && showScanner) {
      setShowScanner(false)
    } else {
      collapse()
    }
  }

  return (
    <BottomSheetScrollView style={styles.container}>
      <View style={styles.itemHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.5}
          onPress={handleBack}
        >
          <ArrowLeftIcon size={24} color={colors.primary400.mode1} />
        </TouchableOpacity>
        <Text style={styles.itemHeaderLabel}>{t`Add a device`}</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.description}>
        {activeTab === TAB.PAIR_THIS
          ? t`Scan this QR code or paste the vault key into the PearPass app on your other device to connect it to your account. This method keeps your account secure.`
          : t`Scan the QR code or paste the vault key from the PearPass app on your other device to connect it to your account. This method keeps your account secure.`}
      </Text>

      {activeTab === TAB.PAIR_THIS ? (
        <PairThisDeviceContent
          tabs={
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, styles.tabActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(TAB.PAIR_THIS)}
              >
                <Text style={[styles.tabText, styles.tabTextActive]}>
                  {t`Share this Vault`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                activeOpacity={0.7}
                onPress={() => setActiveTab(TAB.PAIR_ANOTHER)}
              >
                <Text style={styles.tabText}>{t`Load a Vault`}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <PairAnotherDeviceContent
          showScanner={showScanner}
          setShowScanner={setShowScanner}
          tabs={
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.tab}
                activeOpacity={0.7}
                onPress={() => setActiveTab(TAB.PAIR_THIS)}
              >
                <Text style={styles.tabText}>{t`Share this Vault`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, styles.tabActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(TAB.PAIR_ANOTHER)}
              >
                <Text style={[styles.tabText, styles.tabTextActive]}>
                  {t`Load a Vault`}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {activeTab === TAB.PAIR_THIS && (
        <View style={styles.cautionContainer}>
          <View style={styles.cautionIcon}>
            <YellowErrorIcon size={14} />
          </View>
          <Text style={styles.cautionText}>
            {t`Keep this code private. Anyone with it can connect a device to your vault.`}
          </Text>
        </View>
      )}
    </BottomSheetScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grey500.mode1,
    borderRadius: 999,
    padding: 4,
    marginBottom: 16
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center'
  },
  tabActive: {
    backgroundColor: colors.primary400.mode1
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.white.mode1
  },
  tabTextActive: {
    color: colors.black.mode1,
    fontWeight: '600'
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#050b06',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholder: {
    width: 40
  },
  itemHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemHeaderLabel: {
    fontFamily: 'Inter',
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1
  },
  description: {
    fontFamily: 'Inter',
    color: colors.white.mode1,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  cautionContainer: {
    backgroundColor: '#30250d',
    padding: 10,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffae00',
    flexDirection: 'row',
    gap: 10
  },
  cautionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter',
    color: 'white',
    textAlign: 'left'
  },
  cautionIcon: {
    justifyContent: 'center'
  }
})
