import { useEffect, useMemo, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useCountDown } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { generateQRCodeSVG } from '@tetherto/pear-apps-utils-qr'
import {
  ArrowDownIcon,
  BackIcon,
  CopyIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useInvite } from '@tetherto/pearpass-lib-vault'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Defs, LinearGradient, Rect, Stop, SvgXml } from 'react-native-svg'

import { AppSwitch } from '../../../components/AppSwitch/AppSwitch'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'

const INVITE_EXPIRY_SECONDS = 120
const EXPIRY_OPTIONS = ['never', '15_minutes', '1_hour', '24_hours']

const parseCountdownSeconds = (countdownValue) => {
  const [minutes = '0', seconds = '0'] = countdownValue.split(':')

  return Number(minutes) * 60 + Number(seconds)
}

const InviteExpiry = ({ onFinish }) => {
  const { t } = useLingui()
  const countdownValue = useCountDown({
    initialSeconds: INVITE_EXPIRY_SECONDS,
    onFinish
  })
  const remainingSeconds = parseCountdownSeconds(countdownValue)
  const progress = Math.max(remainingSeconds / INVITE_EXPIRY_SECONDS, 0)

  return (
    <View style={styles.expiryMeta}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.expiryLabel} testID="vault-share-expiry-label">
        {t`Code expires in ${countdownValue}`}
      </Text>
    </View>
  )
}

export const VaultShareScreen = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const { createInvite, deleteInvite, data } = useInvite()
  const permissions = useMemo(
    () => [
      {
        key: 'viewer',
        title: t`Viewer`,
        description: t`Can view and copy items. Can not edit or add`
      },
      {
        key: 'editor',
        title: t`Editor`,
        description: t`Can add, edit, and remove items`
      },
      {
        key: 'admin',
        title: t`Admin`,
        description: t`Can view, copy, add, edit items, and manage vault access`
      }
    ],
    [t]
  )
  const expiryOptions = useMemo(
    () => ({
      never: t`Never`,
      '15_minutes': t`15 minutes`,
      '1_hour': t`1 hour`,
      '24_hours': t`24 hours`
    }),
    [t]
  )

  const [selectedPermission, setSelectedPermission] = useState('viewer')
  const [accessOnce, setAccessOnce] = useState(false)
  const [expiryIndex, setExpiryIndex] = useState(0)
  const [countdownKey, setCountdownKey] = useState(0)
  const [svg, setSvg] = useState('')
  const createInviteRef = useRef(createInvite)
  const deleteInviteRef = useRef(deleteInvite)

  useEffect(() => {
    createInviteRef.current = createInvite
    deleteInviteRef.current = deleteInvite
  }, [createInvite, deleteInvite])

  useEffect(() => {
    const setup = async () => {
      await createInviteRef.current?.()
      setCountdownKey((current) => current + 1)
    }

    setup()

    return () => {
      const cleanup = async () => {
        await deleteInviteRef.current?.()
      }

      cleanup()
    }
  }, [])

  useEffect(() => {
    if (!data?.publicKey) {
      return
    }

    generateQRCodeSVG(data.publicKey, { type: 'svg', margin: 0 }).then(
      (svgString) => {
        setSvg(svgString)
      }
    )
  }, [data?.publicKey])

  const vaultLinkValue = useMemo(() => data?.publicKey || '', [data?.publicKey])

  const handleCopyLink = async () => {
    await copyToClipboard(vaultLinkValue)
  }

  const handleRefreshInvite = async () => {
    await createInviteRef.current?.()
    setCountdownKey((current) => current + 1)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="vaultShareBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#080A05" />
            <Stop offset="100%" stopColor="#15180E" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultShareBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.contentWindow}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              testID="vault-share-back-button"
            >
              <BackIcon size={20} color={colors.white?.mode1 || '#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t`Share Personal Vault`}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t`Access Code`}</Text>
              <View style={styles.sectionCard}>
                <View style={styles.qrPanel}>
                  <View style={styles.qrCodeBox}>
                    {svg.length > 0 ? (
                      <SvgXml
                        testID="vault-share-qr-code"
                        xml={svg}
                        width="100%"
                        height="100%"
                      />
                    ) : null}
                  </View>
                  <InviteExpiry
                    key={countdownKey}
                    onFinish={handleRefreshInvite}
                  />
                </View>

                <View style={styles.linkField}>
                  <View style={styles.linkCopy}>
                    <Text style={styles.linkLabel}>{t`Vault Link`}</Text>
                    <Text
                      style={[
                        styles.linkValue,
                        !vaultLinkValue.length && styles.linkValuePlaceholder
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {vaultLinkValue || t`Generating vault link`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCopyLink}
                    style={styles.copyButton}
                    testID="vault-share-copy-link-button"
                  >
                    <CopyIcon size={14} color={colors.primary400.mode1} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t`Access Permissions`}</Text>
              <View style={styles.optionsCard}>
                {permissions.map((permission, index) => {
                  const isSelected = permission.key === selectedPermission

                  return (
                    <Pressable
                      key={permission.key}
                      style={[
                        styles.permissionRow,
                        index === 0 && styles.permissionRowFirst,
                        index === permissions.length - 1 &&
                          styles.permissionRowLast
                      ]}
                      onPress={() => setSelectedPermission(permission.key)}
                      testID={`vault-share-permission-${permission.key}`}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected
                        ]}
                      >
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <View style={styles.optionCopy}>
                        <Text style={styles.optionTitle}>
                          {permission.title}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {permission.description}
                        </Text>
                      </View>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t`Access Controls`}</Text>
              <View style={styles.optionsCard}>
                <View style={styles.controlRow}>
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>{t`Access Once`}</Text>
                    <Text style={styles.optionDescription}>
                      {t`Automatically revoke access after it’s used once`}
                    </Text>
                  </View>
                  <AppSwitch
                    value={accessOnce}
                    onChange={setAccessOnce}
                    testID="vault-share-access-once-toggle"
                    accessibilityLabel={t`Access Once`}
                    trackColorTrue="#B0D944"
                    trackColorFalse="#2C3618"
                    thumbColor="#ECF1EE"
                    style={styles.switch}
                  />
                </View>

                <Pressable
                  style={[styles.controlRow, styles.controlRowLast]}
                  onPress={() =>
                    setExpiryIndex(
                      (current) => (current + 1) % EXPIRY_OPTIONS.length
                    )
                  }
                  testID="vault-share-access-expires-button"
                >
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>{t`Access Expires`}</Text>
                    <Text style={styles.optionDescription}>
                      {t`Automatically revoke access after the selected time period`}
                    </Text>
                  </View>
                  <View style={styles.expiryPill}>
                    <Text style={styles.expiryText}>
                      {expiryOptions[EXPIRY_OPTIONS[expiryIndex]]}
                    </Text>
                    <ArrowDownIcon size={14} color={colors.white.mode1} />
                  </View>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isCopied
                ? t`Vault link copied`
                : t`Share this code only with a trusted device.`}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  contentWindow: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    flex: 1,
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500'
  },
  headerSpacer: {
    width: 40
  },
  content: {
    flex: 1,
    backgroundColor: '#15180E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: '#212814'
  },
  contentContainer: {
    padding: 16,
    gap: 12
  },
  section: {
    gap: 12
  },
  sectionLabel: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  sectionCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    overflow: 'hidden'
  },
  qrPanel: {
    backgroundColor: '#212814',
    padding: 12,
    gap: 12
  },
  qrCodeBox: {
    alignSelf: 'center',
    width: 198,
    height: 198,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  expiryMeta: {
    alignItems: 'center',
    gap: 8
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#2C3618',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#B0D944'
  },
  expiryLabel: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  linkField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#212814',
    backgroundColor: '#15180E'
  },
  linkCopy: {
    flex: 1,
    gap: 2
  },
  linkLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  linkValue: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  },
  linkValuePlaceholder: {
    color: '#6C7558'
  },
  copyButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionsCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    overflow: 'hidden'
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#212814',
    borderTopWidth: 1,
    borderTopColor: '#212814'
  },
  permissionRowFirst: {
    borderTopWidth: 0
  },
  permissionRowLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#2C3618',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15180E'
  },
  radioOuterSelected: {
    borderColor: '#B0D944',
    backgroundColor: '#B0D944'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: '#B0D944'
  },
  optionCopy: {
    flex: 1,
    gap: 4
  },
  optionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  },
  optionDescription: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#212814',
    borderTopWidth: 1,
    borderTopColor: '#212814'
  },
  controlRowLast: {
    borderTopColor: '#212814'
  },
  switch: {
    width: 44,
    height: 24
  },
  expiryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    backgroundColor: '#212814'
  },
  expiryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C3618',
    backgroundColor: '#15180E'
  },
  footerText: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  }
})
