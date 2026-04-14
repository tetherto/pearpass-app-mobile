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
  InputField,
  MultiSlotInput,
  Radio,
  PageHeader,
  ToggleSwitch,
  rawTokens,
  useTheme,
  Text
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useBlindMirrors } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'

import { useLoadingContext } from '../../../context/LoadingContext'

const { DEFAULT, PERSONAL } = BLIND_PEER_TYPE

export const BlindPeeringSectionV2 = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
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
  const styles = getStyles(theme)
  const peerFields = blindPeersList.map((_, index) =>
    registerItem('blindPeer', index)
  )

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
              <MultiSlotInput
                actions={
                  blindPeersList.length < BLIND_PEERS_LIMIT ? (
                    <Button
                      style={styles.addButton}
                      variant="secondary"
                      onClick={addPeerRow}
                    >
                      <Text
                        color={theme.colors.colorPrimary}
                      >{t`+ Add Another Peer`}</Text>
                    </Button>
                  ) : null
                }
              >
                {peerFields.map((field, index) => (
                  <InputField
                    key={index}
                    label={`#${index + 1} ${t`Blind Peer`}`}
                    value={field.value ?? ''}
                    placeholder={t`Enter Peer Code`}
                    onChangeText={(value) => field.onChange?.(value)}
                    rightSlot={
                      <Button
                        variant="tertiary"
                        size="small"
                        iconBefore={
                          <Close color={theme.colors.colorTextPrimary} />
                        }
                        onClick={() => removeItem(index)}
                        style={styles.closeButton}
                      />
                    }
                  />
                ))}
              </MultiSlotInput>
            )}
          </View>
        )}
      </View>
    </ScreenLayout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    content: {
      padding: rawTokens.spacing16,
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
    optionsContainer: {
      gap: rawTokens.spacing16
    },
    addButton: {
      borderRadius: 0,
      border: 'none',
      width: '100%',
      textAlign: 'left',
      justifyContent: 'flex-start',
      borderWidth: 0
    },
    closeButton: {
      paddingRight: 0
    }
  })
