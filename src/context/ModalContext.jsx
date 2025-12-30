import { createContext, useContext, useState } from 'react'

import { BlurView } from 'expo-blur'
import {
  Modal,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native'

const ModalContext = createContext()

/**
 * @param {{
 *  children: ReactNode
 * }} props
 */
export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState(null)
  const [preventClose, setPreventClose] = useState(false)

  const openModal = (content, options = {}) => {
    setIsOpen(true)
    setContent(content)
    setPreventClose(options.preventClose || false)
  }

  const closeModal = () => {
    if (preventClose) return
    setIsOpen(false)
    setContent(null)
    setPreventClose(false)
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOpen}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.darkOverlay} />
          <BlurView
            intensity={Platform.OS === 'ios' ? 12 : 100}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              style={styles.avoidingView}
              behavior="padding"
              keyboardVerticalOffset={-50}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View style={styles.contentWrapper}>{content}</View>
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.contentWrapper}>{content}</View>
          )}
        </View>
      </Modal>
    </ModalContext.Provider>
  )
}

/**
 * @returns {{
 *   isOpen: boolean,
 *   openModal: (content: ReactNode) => void,
 *   closeModal: () => void
 * }}
 */
export const useModal = () => useContext(ModalContext)

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 46, 46, 0.2)'
  },
  avoidingView: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%'
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  }
})
