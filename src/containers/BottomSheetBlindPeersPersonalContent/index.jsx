import { useEffect, useState } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import {
  BLIND_PEER_TYPE,
  BLIND_PEERS_LIMIT,
  BLIND_PEER_FORM_NAME,
  BLIND_PEERS_FORM_NAME
} from 'pearpass-lib-constants'
import {
  ButtonPrimary,
  ButtonSecondary,
  DeleteIcon,
  PlusIcon,
  SmallArrowIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { useBlindMirrors } from 'pearpass-lib-vault'
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard
} from 'react-native'
import Toast from 'react-native-toast-message'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useLoadingContext } from '../../context/LoadingContext'
import { ButtonLittle, InputField } from '../../libComponents'

const { PERSONAL } = BLIND_PEER_TYPE

/**
 * Personal Blind Peers Input Component
 * @component
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {boolean} props.isEditMode
 */
export const BottomSheetBlindPeersPersonalContent = ({
  onClose,
  onConfirm,
  isEditMode = false
}) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { setIsLoading: setIsLoadingContext } = useLoadingContext()
  const { addBlindMirrors, removeBlindMirror, removeAllBlindMirrors, data: blindMirrorsData } = useBlindMirrors()
  const [keyboardHeight, setKeyboardHeight] = useState(0)


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
    return {
      blindPeers: [{ name: BLIND_PEER_FORM_NAME }]
    }
  }

  const { registerArray } = useForm({
    initialValues: getInitialValues()
  })

  const {
    value: blindPeersList,
    addItem,
    registerItem,
    removeItem
  } = registerArray(BLIND_PEERS_FORM_NAME)

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height)
        }
      )
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardHeight(0)
        }
      )

      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }
  }, [])

  const handleGoBack = () => {
    collapse()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleBlindPeersConfirm = async () => {
    const blindPeers = blindPeersList
      .map((peer) => peer.blindPeer?.trim())
      .filter((peer) => peer && peer.length > 0)

    if (blindPeers.length) {
      try {
        setIsLoadingContext(true)

        if (isEditMode && blindMirrorsData?.[0]?.isDefault) {
          await removeAllBlindMirrors()
        }

        await addBlindMirrors(blindPeers)
        Toast.show({
          type: 'baseToast',
          text1: t`Manual Blind Peers enabled successfully`,
          position: 'bottom',
          bottomOffset: 100
        })
        onConfirm({ blindPeerType: PERSONAL })
      } catch {
        Toast.show({
          type: 'baseToast',
          text1: t`Error adding Blind Peers`,
          position: 'bottom',
          bottomOffset: 100
        })
        onClose()
      } finally {
        setIsLoadingContext(false)
      }
    }
  }

  const addPeerRow = () => {
    if (blindPeersList.length < BLIND_PEERS_LIMIT) {
      addItem({ name: BLIND_PEER_FORM_NAME })
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          Platform.OS === 'android' &&
          keyboardHeight > 0 && {
            paddingBottom: keyboardHeight + 20
          }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <ButtonLittle
                variant="secondary"
                borderRadius="md"
                startIcon={SmallArrowIcon}
                onPress={handleGoBack}
              />
            </View>
            <Text style={[styles.title, styles.withBackButton]}>
              {t`Add Personal Blind Peers`}
            </Text>
          </View>

          <View style={styles.fullWidth}>
            {blindPeersList.map((blindPeer, index) => (
              <InputField
                key={blindPeer.id}
                label={'#' + (index + 1) + ' ' + t`Blind Peer`}
                placeholder={t`Add here your code...`}
                isFirst={index === 0}
                {...registerItem('blindPeer', index)}
                additionalItems={
                  index === 0 ? (
                    <ButtonLittle
                      startIcon={PlusIcon}
                      variant="secondary"
                      onPress={addPeerRow}
                    >
                      {t`Add Peer`}
                    </ButtonLittle>
                  ) : (
                    <ButtonLittle
                      startIcon={DeleteIcon}
                      variant="secondary"
                      onPress={() => removeItem(index)}
                    >
                      {t`Remove Peer`}
                    </ButtonLittle>
                  )
                }
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <ButtonPrimary onPress={handleBlindPeersConfirm} stretch>
              {t`Confirm`}
            </ButtonPrimary>
            <ButtonSecondary onPress={handleCancel} stretch>
              {t`Cancel`}
            </ButtonSecondary>
          </View>
        </View>
      </BottomSheetScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 80 : 20
  },
  wrapper: {
    gap: 25,
    alignItems: 'center'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1
  },
  withBackButton: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }]
  },
  fullWidth: {
    width: '100%'
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    paddingBottom: Platform.OS === 'android' ? 20 : 0
  }
})
