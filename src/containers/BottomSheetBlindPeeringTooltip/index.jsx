import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { BLIND_PEERS_LEARN_MORE } from 'pearpass-lib-constants'
import { RedirectIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { Text, View, StyleSheet, Linking, Pressable } from 'react-native'
import Toast from 'react-native-toast-message'

/**
 * @component
 * @param {Object} props
 */
export const BottomSheetBlindPeeringTooltip = () => {
  const { t } = useLingui()
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
  return (
    <BottomSheetView style={styles.container}>
      <Text style={styles.title}>{t`Blind Peer`}</Text>
      <View style={styles.wrapper}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: colors.white.mode1,
            textAlign: 'center'
          }}
        >{t`Choose between:`}</Text>
        <Text style={styles.description}>
          {t`• `}
          <Text style={styles.boldText}>{t`Automatic Blind Peers: `}</Text>
          {t`Let PearPass allocate Blind Peers for you to handle syncing.`}
        </Text>
        <Text style={styles.description}>
          {t`• `}
          <Text style={styles.boldText}>{t`Manual Blind Peers: `}</Text>
          {t`Setup your own private Blind Peers.`}
        </Text>
        <Text style={styles.description}>
          {t`In both cases, all data stays fully encrypted, ensuring safe, non-intrusive replication and better data consistency.`}
        </Text>
      </View>
      <View style={{ alignSelf: 'center' }}>
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
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1,
    lineHeight: 24,
    marginTop: 25,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white.mode1,
    marginTop: 5
  },
  boldText: {
    fontWeight: '700'
  },
  wrapper: { alignItems: 'flex-start', marginTop: 15 },
  buttonContainer: {
    width: '100%',
    marginTop: 10
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
