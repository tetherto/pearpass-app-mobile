import { useState } from 'react'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { BLIND_PEER_TYPE } from 'pearpass-lib-constants'
import {
  ButtonPrimary,
  ButtonSecondary
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { useBlindMirrors } from 'pearpass-lib-vault'
import { Text, View, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'

import { RadioSelect } from '../../components/RadioSelect'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useLoadingContext } from '../../context/LoadingContext'
import { BottomSheetBlindPeersPersonalContent } from '../BottomSheetBlindPeersPersonalContent'

const { DEFAULT, PERSONAL } = BLIND_PEER_TYPE

/**
 * @component
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 */
export const BottomSheetBlindPeersContent = ({ onClose, onConfirm }) => {
  const { t } = useLingui()
  const { expand } = useBottomSheet()
  const { setIsLoading: setIsLoadingContext } = useLoadingContext()
  const { addDefaultBlindMirrors } = useBlindMirrors()
  const [selectedOption, setSelectedOption] = useState(DEFAULT)

  const handleConfirm = async () => {
    if (selectedOption === DEFAULT) {
      try {
        setIsLoadingContext(true)
        await addDefaultBlindMirrors()
        Toast.show({
          type: 'baseToast',
          text1: t`Automatic Blind Peers enabled successfully`,
          position: 'bottom',
          bottomOffset: 100
        })
        onConfirm({ blindPeerType: DEFAULT })
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
    } else {
      setTimeout(() => {
        expand({
          children: (
            <BottomSheetBlindPeersPersonalContent
              onClose={onClose}
              onConfirm={onConfirm}
            />
          ),
          snapPoints: ['80%', '80%'],
          enableContentPanningGesture: false
        })
      }, 300)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{t`Choose your Blind Peer`}</Text>
        <View style={styles.fullWidth}>
          <RadioSelect
            options={[
              { label: t`Automatic Blind Peers `, value: DEFAULT },
              { label: t`Manual Blind Peers`, value: PERSONAL }
            ]}
            selectedOption={selectedOption}
            onChange={(value) => setSelectedOption(value)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonPrimary onPress={handleConfirm} stretch>
            {t`Confirm`}
          </ButtonPrimary>
          <ButtonSecondary onPress={handleCancel} stretch>
            {t`Cancel`}
          </ButtonSecondary>
        </View>
      </View>
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  wrapper: {
    gap: 25,
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1
  },
  buttonContainer: {
    width: '100%',
    gap: 15
  }
})
