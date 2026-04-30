import { useCallback, useState, useEffect, useMemo, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import {
  BLIND_PEER_TYPE,
  BLIND_PEERS_LEARN_MORE,
  BLIND_PEERS_LIMIT,
  BLIND_PEER_FORM_NAME,
  BLIND_PEERS_FORM_NAME
} from '@tetherto/pearpass-lib-constants'
import {
  Button,
  InputField,
  Link,
  MultiSlotInput,
  Radio,
  PageHeader,
  Text,
  ToggleSwitch,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Add, Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useBlindMirrors } from '@tetherto/pearpass-lib-vault'
import { Linking, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'

import { UnsavedChangesSheet } from '../../../containers/BottomSheet/UnsavedChangesSheet'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useLoadingContext } from '../../../context/LoadingContext'

const { DEFAULT, PERSONAL } = BLIND_PEER_TYPE

export const BlindPeeringSectionV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { expand, collapse } = useBottomSheet()
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

  const performSave = async () => {
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
        return true
      }

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
        return false
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
      return true
    } catch {
      Toast.show({
        type: 'baseToast',
        text1: t`Error adding Blind Peers`,
        position: 'bottom',
        bottomOffset: 100
      })
      return false
    } finally {
      isSavingRef.current = false
      setIsLoading(false)
      setIsLoadingContext(false)
    }
  }

  const handleSave = async () => {
    await performSave()
  }

  const addPeerRow = () => {
    if (blindPeersList.length < BLIND_PEERS_LIMIT) {
      addItem({ name: BLIND_PEER_FORM_NAME })
    }
  }

  const isManual = peerMode === PERSONAL
  const styles = getStyles(theme)

  const handleChangeItem = (index, text) => {
    const updated = blindPeersList.map((item, i) =>
      i === index ? { ...item, blindPeer: text } : item
    )
    setValues({ blindPeers: updated })
  }

  const initialState = useMemo(() => {
    const savedManual = blindMirrorsData
      .filter((item) => !item.isDefault)
      .map((item) => item.key)

    return {
      isEnabled: blindMirrorsData.length > 0,
      peerMode: blindMirrorsData[0]?.isDefault ? DEFAULT : PERSONAL,
      peers: savedManual
    }
  }, [blindMirrorsData])

  const isDirty = useMemo(() => {
    if (isEnabled !== initialState.isEnabled) return true
    if (!isEnabled) return false
    if (peerMode !== initialState.peerMode) return true
    if (peerMode !== PERSONAL) return false

    const currentPeers = blindPeersList
      .map((item) => item.blindPeer?.trim())
      .filter((peer) => peer && peer.length > 0)

    if (currentPeers.length !== initialState.peers.length) return true
    return currentPeers.some((peer, i) => peer !== initialState.peers[i])
  }, [isEnabled, peerMode, blindPeersList, initialState])

  useFocusEffect(
    useCallback(() => {
      const sub = navigation.addListener('beforeRemove', (e) => {
        if (!isDirty) return
        e.preventDefault()

        const proceed = () => {
          collapse()
          navigation.dispatch(e.data.action)
        }

        expand({
          children: (
            <UnsavedChangesSheet
              description={t`You have unsaved changes to your Blind Peering settings. Would you like to save them before leaving?`}
              onClose={collapse}
              onDiscard={proceed}
              onSave={async () => {
                collapse()
                const ok = await performSave()
                if (ok) navigation.dispatch(e.data.action)
              }}
            />
          )
        })
      })

      return sub
    }, [isDirty, navigation, expand, collapse])
  )

  return (
    <Layout
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
        subtitle={
          <Text as="span" variant="label">
            {t`Sync your encrypted vault with other devices to improve availability and reliability. Peers only see encrypted data - they can't access or read anything. `}
            <Link
              href={BLIND_PEERS_LEARN_MORE}
              isExternal
              onClick={() => Linking.openURL(BLIND_PEERS_LEARN_MORE)}
            >
              {t`Learn more about Blind Peering.`}
            </Link>
          </Text>
        }
      />

      <View style={styles.card}>
        <ToggleSwitch
          checked={isEnabled}
          onChange={handleToggle}
          label={t`Enable Blind Peering`}
          description={t`Allows your vault to sync through blind peers`}
        />

        {isEnabled && (
          <View style={styles.peerModeGroup}>
            <View style={styles.peerModeRow}>
              <Radio
                builtIn
                options={[
                  {
                    value: DEFAULT,
                    label: t`Automatic Blind Peers`,
                    description: t`Let PearPass allocate blind peers for you to handle syncing`
                  }
                ]}
                value={peerMode}
                onChange={handlePeerModeChange}
              />
            </View>

            <View style={styles.peerModeDivider} />

            <View style={styles.peerModeRow}>
              <Radio
                builtIn
                options={[
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
                <MultiSlotInput
                  actions={
                    blindPeersList.length < BLIND_PEERS_LIMIT ? (
                      <Button
                        variant="tertiaryAccent"
                        iconBefore={<Add />}
                        onClick={addPeerRow}
                      >
                        {t`Add Another Peer`}
                      </Button>
                    ) : null
                  }
                >
                  {blindPeersList.map((item, index) => (
                    <InputField
                      key={index}
                      label={t`#${index + 1} Blind Peer`}
                      value={item.blindPeer ?? ''}
                      placeholder={t`Enter Peer Code`}
                      onChange={(e) => handleChangeItem(index, e.target.value)}
                      rightSlot={
                        blindPeersList.length > 1 ? (
                          <Button
                            variant="tertiary"
                            size="small"
                            iconBefore={
                              <Close color={theme.colors.colorTextPrimary} />
                            }
                            onClick={() => removeItem(index)}
                            aria-label={t`Remove peer`}
                          />
                        ) : null
                      }
                    />
                  ))}
                </MultiSlotInput>
              )}
            </View>
          </View>
        )}
      </View>
    </Layout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    content: {
      paddingTop: rawTokens.spacing24,
      gap: rawTokens.spacing20,
      flexGrow: 1
    },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.colorBorderSecondary,
      borderRadius: rawTokens.radius8,
      padding: rawTokens.spacing16,
      gap: rawTokens.spacing16
    },
    peerModeGroup: {
      borderWidth: 1,
      borderColor: theme.colors.colorBorderPrimary,
      borderRadius: rawTokens.radius8,
      overflow: 'hidden'
    },
    peerModeRow: {
      padding: rawTokens.spacing12,
      gap: rawTokens.spacing12
    },
    peerModeDivider: {
      height: 1,
      backgroundColor: theme.colors.colorBorderPrimary
    }
  })
