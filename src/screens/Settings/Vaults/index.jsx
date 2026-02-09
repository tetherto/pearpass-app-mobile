import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useVault } from 'pearpass-lib-vault'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { BottomSheetAddDeviceContent } from '../../../containers/BottomSheetAddDeviceContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { ButtonCreate, ButtonLittle } from '../../../libComponents'
import { ExportSection } from '../TabExport'
import { ImportSection } from '../TabImport'
import { VaultsManageSection } from '../TabVaultsSettings'

const getDeviceDisplayName = (deviceName) => {
  const { t } = useLingui()
  if (!deviceName) return deviceName

  const lowerName = deviceName.toLowerCase()

  if (lowerName.startsWith('ios')) {
    return t`Iphone`
  }

  if (lowerName.startsWith('android')) {
    return t`Android`
  }

  return deviceName
}

export const Vaults = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { expand } = useBottomSheet()
  const { data, refetch: refetchVault } = useVault()

  useEffect(() => {
    refetchVault()
  }, [])

  const handleAddDevice = () => {
    expand({
      children: <BottomSheetAddDeviceContent />,
      snapPoints: ['10%', '50%', '90%']
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>{t`Vaults`}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VaultsManageSection />
        {(data?.devices?.length ?? 0) > 0 && (
          <CardSingleSetting title={t`Linked devices`}>
            <View style={styles.sectionContent}>
              <Text style={styles.description}>
                {t`These are the devices currently synced with this vault.`}
              </Text>
              <View style={styles.deviceList}>
                {data?.devices?.map((device, index) => (
                  <ListItem
                    key={device.name + index}
                    name={getDeviceDisplayName(device?.name)}
                    date={device.createdAt}
                  />
                ))}
              </View>
              <ButtonCreate onPress={handleAddDevice}>
                {t`Add device`}
              </ButtonCreate>
            </View>
          </CardSingleSetting>
        )}
        <ExportSection />
        <ImportSection />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 20,
    paddingBottom: 0,
    height: '100%',
    gap: 20,
    backgroundColor: colors.grey500.mode1
  },
  header: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  screenTitle: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700'
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 40
  },
  sectionContent: {
    gap: 15
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  deviceList: {
    gap: 15
  }
})
