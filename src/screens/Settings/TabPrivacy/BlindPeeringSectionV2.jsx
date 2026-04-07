import { useState, useEffect, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  BLIND_PEER_TYPE,
  BLIND_PEERS_LIMIT,
  BLIND_PEER_FORM_NAME,
  BLIND_PEERS_FORM_NAME
} from '@tetherto/pearpass-lib-constants'
import {
  Button,
  PageHeader,
  Radio,
  Text,
  ToggleSwitch,
  rawTokens
} from '@tetherto/pearpass-lib-ui-kit'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useBlindMirrors } from '@tetherto/pearpass-lib-vault'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'

import { useLoadingContext } from '../../../context/LoadingContext'

const { DEFAULT, PERSONAL } = BLIND_PEER_TYPE

export const BlindPeeringSectionV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { setIsLoading: setIsLoadingContext } = useLoadingContext()

  const {
    addDefaultBlindMirrors,
    addBlindMirrors,
    removeAllBlindMirrors,
    data: blindMirrorsData,
    getBlindMirrors
  } = useBlindMirrors()

  const [isEnabled, setIsEnabled] = useState(false)
  const [peerMode, setPeerMode] = useState(DEFAULT)
  const [isLoading, setIsLoading] = useState(false)
  const isSavingRef = useRef(false)

  const getInitialValues = () => {
    const manualPeers = blindMirrorsData.filter((item) => !item.isDefault)
    if (manualPeers.length > 0) {
      return {
        blindPeers: manualPeers.map((item) => ({
          name: BLIND_PEER_FORM_NAME,
          blindPeer: item.key
        }))
      }
    }
    return { blindPeers: [{ name: BLIND_PEER_FORM_NAME }] }
  }
  const { registerArray, setValues } = useForm({
    initialValues: getInitialValues()
  })

  const {
    value: blindPeersList,
    addItem,
    registerItem,
    removeItem
  } = registerArray(BLIND_PEERS_FORM_NAME)

  useEffect(() => {
    getBlindMirrors()
  }, [])

  useEffect(() => {
    if (isSavingRef.current) return

    if (blindMirrorsData.length > 0) {
      setIsEnabled(true)
      const isDefault = blindMirrorsData[0].isDefault
      setPeerMode(isDefault ? DEFAULT : PERSONAL)
      if (!isDefault) {
        setValues({
          blindPeers: blindMirrorsData.map((item) => ({
            name: BLIND_PEER_FORM_NAME,
            blindPeer: item.key
          }))
        })
      }
    } else {
      setIsEnabled(false)
      setPeerMode(DEFAULT)
    }
  }, [blindMirrorsData])

  const handleToggle = async (checked) => {
    if (!checked) {
      try {
        setIsLoadingContext(true)
        await removeAllBlindMirrors()
      } catch {
        Toast.show({
          type: 'baseToast',
          text1: t`Error removing Blind Peers`,
          position: 'bottom',
          bottomOffset: 100
        })
      } finally {
        setIsLoadingContext(false)
      }
      return
    }
    setIsEnabled(true)
    setPeerMode(DEFAULT)
  }

  const handlePeerModeChange = (value) => {
    setPeerMode(value)
    if (value === DEFAULT) {
      setValues({ blindPeers: [{ name: BLIND_PEER_FORM_NAME }] })
    }
  }

  const handleSave = async () => {
    try {
      isSavingRef.current = true
      setIsLoading(true)
      setIsLoadingContext(true)

      if (peerMode === DEFAULT) {
        if (blindMirrorsData.length > 0 && !blindMirrorsData[0].isDefault) {
          await removeAllBlindMirrors()
        }
        await addDefaultBlindMirrors()
        Toast.show({
          type: 'baseToast',
          text1: t`Automatic Blind Peers enabled successfully`,
          position: 'bottom',
          bottomOffset: 100
        })
      } else {
        const peers = blindPeersList
          .map((peer) => peer.blindPeer?.trim())
          .filter((peer) => peer && peer.length > 0)

        if (!peers.length) {
          Toast.show({
            type: 'baseToast',
            text1: t`Please add at least one peer code`,
            position: 'bottom',
            bottomOffset: 100
          })
          return
        }

        if (blindMirrorsData.length > 0) {
          await removeAllBlindMirrors()
        }
        await addBlindMirrors(peers)
        Toast.show({
          type: 'baseToast',
          text1: t`Manual Blind Peers enabled successfully`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    } catch {
      Toast.show({
        type: 'baseToast',
        text1: t`Error adding Blind Peers`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      isSavingRef.current = false
      setIsLoading(false)
      setIsLoadingContext(false)
    }
  }

  const addPeerRow = () => {
    if (blindPeersList.length < BLIND_PEERS_LIMIT) {
      addItem({ name: BLIND_PEER_FORM_NAME })
    }
  }

  const isManual = peerMode === PERSONAL

  return (
    <ScreenLayout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
      footer={
        isEnabled ? (
          <Button
            variant="primary"
            fullWidth
            disabled={isLoading}
            isLoading={isLoading}
            onClick={handleSave}
          >
            {t`Save Changes`}
          </Button>
        ) : null
      }
    >
      <PageHeader
        title={t`Blind Peering`}
        subtitle={t`Sync your encrypted vault with other devices to improve availability and reliability. Peers only see encrypted data - they can't access or read anything`}
      />

      <View style={styles.card}>
        <ToggleSwitch
          checked={isEnabled}
          onChange={handleToggle}
          label={t`Enable Blind Peering`}
          description={t`Allows your vault to sync through blind peers`}
        />

        {isEnabled && (
          <View style={styles.optionsContainer}>
            <Radio
              options={[
                {
                  value: DEFAULT,
                  label: t`Automatic Blind Peers`,
                  description: t`Let PearPass allocate blind peers for you to handle syncing`
                },
                {
                  value: PERSONAL,
                  label: t`Manual Blind Peers`,
                  description: t`Setup your own private blind peers`
                }
              ]}
              value={peerMode}
              onChange={handlePeerModeChange}
            />

            {isManual && (
              <View style={styles.peersContainer}>
                {blindPeersList.map((peer, index) => {
                  const field = registerItem('blindPeer', index)
                  return (
                    <View
                      key={peer.id}
                      style={[
                        styles.peerRow,
                        index < blindPeersList.length - 1 &&
                          styles.peerRowBorder
                      ]}
                    >
                      <View style={styles.peerInputWrapper}>
                        <Text variant="caption" color="#FFFFFF">
                          {'#' + (index + 1) + ' ' + t`Blind Peer`}
                        </Text>
                        <TextInput
                          style={styles.peerInput}
                          value={field.value}
                          onChangeText={field.onChange}
                          placeholder={t`Enter Peer Code`}
                          placeholderTextColor={colors.grey100.mode1}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                      <Pressable
                        onPress={() => removeItem(index)}
                        style={styles.removeButton}
                        hitSlop={8}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </Pressable>
                    </View>
                  )
                })}

                {blindPeersList.length < BLIND_PEERS_LIMIT && (
                  <Pressable onPress={addPeerRow} style={styles.addPeerRow}>
                    <Text style={styles.addPeerText}>
                      {t`+ Add Another Peer`}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing20,
    flexGrow: 1
  },
  card: {
    borderWidth: 1,
    borderColor: '#2C3618',
    borderRadius: rawTokens.radius16,
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing16
  },
  optionsContainer: {
    gap: rawTokens.spacing16
  },
  peersContainer: {
    borderWidth: 1,
    borderColor: '#2C3618',
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing10,
    gap: rawTokens.spacing8
  },
  peerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2C3618'
  },
  peerInputWrapper: {
    flex: 1,
    gap: rawTokens.spacing4
  },
  peerInput: {
    color: colors.white.mode1,
    fontFamily: rawTokens.fontPrimary,
    fontSize: rawTokens.fontSize14
  },
  removeButton: {
    padding: rawTokens.spacing4
  },
  removeButtonText: {
    color: colors.grey200.mode1,
    fontSize: 18,
    lineHeight: 20
  },
  addPeerRow: {
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing10,
    borderTopWidth: 1,
    borderTopColor: '#2C3618'
  },
  addPeerText: {
    color: colors.primary400.mode1,
    fontFamily: rawTokens.fontPrimary,
    fontSize: rawTokens.fontSize12,
    fontWeight: rawTokens.weightRegular
  }
})
