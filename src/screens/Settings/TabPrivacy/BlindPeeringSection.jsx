import { useState, useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { BLIND_PEERS_LEARN_MORE } from 'pearpass-lib-constants'
import {
  RedirectIcon,
  TooltipIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { useBlindMirrors } from 'pearpass-lib-vault'
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'

import { BottomSheetBlindPeeringTooltip } from '../../../containers/BottomSheetBlindPeeringTooltip'
import { BottomSheetBlindPeersContent } from '../../../containers/BottomSheetBlindPeersContent'
import { RuleSelector } from '../../../containers/BottomSheetPassGeneratorContent/RuleSelector'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'

export const BlindPeeringSection = () => {
  const { t } = useLingui()
  const { expand, collapse } = useBottomSheet()
  const { setIsLoading: setIsLoadingContext } = useLoadingContext()
  const [blindPeersRules, setBlindPeersRules] = useState({
    blindPeers: false
  })
  const {
    removeAllBlindMirrors,
    data: blindMirrorsData,
    getBlindMirrors
  } = useBlindMirrors()

  useEffect(() => {
    if (blindMirrorsData.length > 0) {
      setBlindPeersRules({ blindPeers: true })
    } else {
      setBlindPeersRules({ blindPeers: false })
    }
  }, [blindMirrorsData])

  useEffect(() => {
    getBlindMirrors()
  }, [])

  const handleTooltipPress = () => {
    expand({
      children: <BottomSheetBlindPeeringTooltip onClose={collapse} />,
      snapPoints: ['10%', '50%']
    })
  }

  const handleLearnMorePress = async () => {
    const url = BLIND_PEERS_LEARN_MORE
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      await Linking.openURL(url)
    } else {
      Toast.show({
        type: 'baseToast',
        text1: t`Cannot open URL`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  const handleBlindPeersConfirm = () => {
    setBlindPeersRules({ blindPeers: true })
    collapse()
  }

  const removeBlindPeers = async () => {
    try {
      setIsLoadingContext(true)
      await removeAllBlindMirrors()
    } catch {
      setBlindPeersRules({ blindPeers: true })
      Toast.show({
        type: 'baseToast',
        text1: t`Error removing all Blind Peers`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setIsLoadingContext(false)
    }
  }

  const handleBlindPeersToggle = (ruleName, isToggled) => {
    if (isToggled) {
      expand({
        children: (
          <BottomSheetBlindPeersContent
            onClose={collapse}
            onConfirm={handleBlindPeersConfirm}
          />
        ),
        snapPoints: ['10%', '40%', '75%']
      })
      return false
    }

    removeBlindPeers()
    return true
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t`Blind Peering`}</Text>
        <Pressable onPress={handleTooltipPress}>
          <TooltipIcon color={colors.white.mode1} />
        </Pressable>
      </View>
      <View style={styles.divider} />
      <View>
        <RuleSelector
          rules={[
            {
              name: 'blindPeers',
              label: t`Private Connections`,
              description: t`Sync your encrypted vault securely with blind peers to improve availability and consistency. Blind peers cannot read your data.`
            }
          ]}
          selectedRules={blindPeersRules}
          setRules={setBlindPeersRules}
          onToggle={handleBlindPeersToggle}
        />
        <Pressable
          style={styles.learnMoreButton}
          onPress={handleLearnMorePress}
        >
          <RedirectIcon color={colors.primary400.mode1} />
          <Text
            style={styles.learnMoreText}
          >{t`Learn more about blind peering.`}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.grey500.mode1,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    borderRadius: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: colors.white.mode1,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter'
  },
  divider: {
    height: 4,
    width: 100,
    color: colors.grey300.mode1,
    marginVertical: 15
  },
  learnMoreButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  learnMoreText: {
    color: colors.primary400.mode1,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginLeft: 5
  }
})
