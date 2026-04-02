import { useEffect, useMemo, useState } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { formatDate } from '@tetherto/pear-apps-utils-date'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  BackIcon,
  KebabMenuIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVault } from '@tetherto/pearpass-lib-vault'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { BottomSheetVaultAction } from '../../../containers/BottomSheetVaultAction'
import { ConfirmModalContent } from '../../../containers/Modal/ConfirmModalContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import {
  ButtonLittle,
  ButtonPrimary,
  ButtonSecondary
} from '../../../libComponents'
import { buildVaultAccessEntries } from '../../../utils/vaultFlow'

const getRoleLabel = (role, t) => {
  if (role === 'admin') {
    return t`Admin`
  }

  return t`Viewer`
}

const getStatusLabel = (kind, t) => {
  if (kind === 'owner') {
    return t`Owner`
  }

  return t`Linked device`
}

const MembersManagerSheet = ({ entries, onShare, onRemoveAccess }) => {
  const { t } = useLingui()

  return (
    <BottomSheetScrollView
      style={styles.sheetContainer}
      contentContainerStyle={styles.sheetContent}
    >
      <Text style={styles.sheetEyebrow}>{t`Members manager`}</Text>
      <Text style={styles.sheetTitle}>{t`Vault access`}</Text>
      <Text style={styles.sheetDescription}>
        {t`Review who can currently reach this vault and open the share flow for a new trusted device.`}
      </Text>

      <View style={styles.membersList}>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.memberCard}>
            <View style={styles.memberIdentity}>
              <Text style={styles.memberName}>{entry.name}</Text>
              <Text style={styles.memberMeta}>
                {getStatusLabel(entry.kind, t)}
                {entry.createdAt
                  ? ` · ${formatDate(entry.createdAt, 'dd-mm-yyyy', '/')}`
                  : ''}
              </Text>
            </View>
            <View style={styles.memberActions}>
              <View style={styles.roleChip}>
                <Text style={styles.roleChipText}>
                  {getRoleLabel(entry.role, t)}
                </Text>
              </View>
              {entry.removable ? (
                <TouchableOpacity
                  onPress={() => onRemoveAccess(entry)}
                  style={styles.removeAccessButton}
                >
                  <Text style={styles.removeAccessButtonText}>{t`Remove`}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <ButtonPrimary stretch onPress={onShare}>
        {t`Share Personal Vault`}
      </ButtonPrimary>
    </BottomSheetScrollView>
  )
}

export const VaultSettingsScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { collapse, expand } = useBottomSheet()
  const { closeModal, openModal } = useModal()

  const { data: vault, isVaultProtected } = useVault()
  const vaultId = route?.params?.vaultId || vault?.id
  const vaultName = vault?.name || route?.params?.vaultName || vault?.id
  const [isProtected, setIsProtected] = useState(false)

  const accessEntries = useMemo(
    () => buildVaultAccessEntries({ devices: vault?.devices }),
    [vault?.devices]
  )

  const linkedDevicesCount = accessEntries.filter(
    (entry) => entry.kind === 'device'
  ).length

  useEffect(() => {
    const checkProtection = async () => {
      if (!vaultId) {
        return
      }

      const result = await isVaultProtected(vaultId)
      setIsProtected(result)
    }

    checkProtection()
  }, [isVaultProtected, vaultId])

  const handleRename = () => {
    navigation.navigate('VaultRenameScreen', {
      vaultId,
      vaultName
    })
  }

  const handlePassword = () => {
    navigation.navigate('VaultPasswordScreen', {
      vaultId,
      vaultName
    })
  }

  const handleShare = () => {
    collapse?.()
    navigation.navigate('VaultShareScreen', {
      vaultId,
      vaultName
    })
  }

  const handleRemoveAccess = (entry) => {
    openModal(
      <ConfirmModalContent
        title={t`Remove access`}
        text={t`This revoke flow is already designed for the mobile hub, but removing access for ${entry.name} is not yet connected to the vault SDK. We will keep this device listed for now.`}
        primaryLabel={t`Got it`}
        secondaryLabel={t`Cancel`}
        primaryAction={() => {
          closeModal()
          Toast.show({
            type: 'baseToast',
            text1: t`Access removal is coming soon`,
            position: 'bottom',
            bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
          })
        }}
        secondaryAction={closeModal}
      />
    )
  }

  const handleMembers = () => {
    expand({
      children: (
        <MembersManagerSheet
          entries={accessEntries}
          onShare={handleShare}
          onRemoveAccess={handleRemoveAccess}
        />
      ),
      snapPoints: ['10%', '80%']
    })
  }

  const handleDelete = () => {
    navigation.navigate('VaultDeleteScreen', {
      vaultId,
      vaultName
    })
  }

  const openActionMenu = () => {
    expand({
      children: (
        <BottomSheetVaultAction
          vaultId={vaultId}
          vaultName={vaultName}
          onRename={handleRename}
          onPassword={handlePassword}
          onMembers={handleMembers}
          onShare={handleShare}
          onDelete={handleDelete}
        />
      ),
      snapPoints: ['10%', '74%']
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
        <View style={styles.headerCopy}>
          <Text style={styles.screenEyebrow}>{t`Vault settings`}</Text>
          <Text style={styles.screenTitle}>{vaultName}</Text>
        </View>
        <ButtonLittle
          startIcon={KebabMenuIcon}
          variant="secondary"
          borderRadius="md"
          onPress={openActionMenu}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={[styles.statusPill, styles.statusPillActive]}>
              <Text style={styles.statusPillText}>
                {isProtected
                  ? t`Vault password enabled`
                  : t`Master password only`}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text
                style={styles.statusPillText}
              >{t`${linkedDevicesCount} linked devices`}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{vaultName}</Text>
          <Text style={styles.heroSubtitle}>
            {t`Manage identity, encryption, sharing, and destructive actions for this vault from one place.`}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t`Vault details`}</Text>
          <View style={styles.sectionContent}>
            <View style={styles.metricRow}>
              <Text style={styles.label}>{t`Vault name`}</Text>
              <Text style={styles.value}>{vaultName}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.label}>{t`Created`}</Text>
              <Text style={styles.value}>
                {vault?.createdAt
                  ? formatDate(vault.createdAt, 'dd-mm-yyyy', '/')
                  : '--'}
              </Text>
            </View>
            <ButtonSecondary stretch onPress={handleRename}>
              {t`Rename Vault`}
            </ButtonSecondary>
          </View>
        </View>

        {PROTECTED_VAULT_ENABLED && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t`Security layer`}</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.description}>
                {isProtected
                  ? t`This vault currently has its own password on top of the master password.`
                  : t`Add a dedicated vault password when this vault needs an extra encryption layer.`}
              </Text>
              <ButtonSecondary stretch onPress={handlePassword}>
                {isProtected ? t`Update Vault Password` : t`Set Vault Password`}
              </ButtonSecondary>
            </View>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t`Members & sharing`}</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.description}>
              {t`Review who has access to this vault and share it with a trusted device using a short-lived QR flow.`}
            </Text>
            <View style={styles.membersList}>
              {accessEntries.slice(0, 3).map((entry) => (
                <View key={entry.id} style={styles.memberRow}>
                  <View style={styles.memberCopy}>
                    <Text style={styles.memberName}>{entry.name}</Text>
                    <Text style={styles.memberStatus}>
                      {getStatusLabel(entry.kind, t)}
                    </Text>
                  </View>
                  <View style={styles.roleChip}>
                    <Text style={styles.roleChipText}>
                      {getRoleLabel(entry.role, t)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <ButtonSecondary stretch onPress={handleMembers}>
              {t`Manage Access`}
            </ButtonSecondary>
            <ButtonPrimary stretch onPress={handleShare}>
              {t`Share Personal Vault`}
            </ButtonPrimary>
          </View>
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>{t`Danger Zone`}</Text>
          <Text style={styles.dangerText}>
            {t`Deleting a vault requires master password confirmation and cannot be undone.`}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>{t`Delete Vault`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A05',
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8
  },
  headerCopy: {
    flex: 1,
    gap: 2
  },
  screenEyebrow: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  screenTitle: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700'
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 40
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#15180E',
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  heroTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 26,
    fontWeight: '700'
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F130A'
  },
  statusPillActive: {
    backgroundColor: 'rgba(163,230,53,0.14)'
  },
  statusPillText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600'
  },
  sectionCard: {
    borderRadius: 24,
    backgroundColor: '#12160C',
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700'
  },
  sectionContent: {
    gap: 15
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  label: {
    color: 'rgba(255,255,255,0.58)',
    fontFamily: 'Inter',
    fontSize: 14,
    flex: 1
  },
  value: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right'
  },
  description: {
    color: 'rgba(255,255,255,0.68)',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20
  },
  membersList: {
    backgroundColor: '#0E1209',
    borderRadius: 18,
    padding: 12,
    gap: 10
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  memberCopy: {
    flex: 1,
    gap: 4
  },
  memberName: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600'
  },
  memberStatus: {
    color: 'rgba(255,255,255,0.54)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500'
  },
  roleChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(163,230,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.24)'
  },
  roleChipText: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600'
  },
  dangerZone: {
    marginTop: 4,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 20,
    gap: 12,
    backgroundColor: 'rgba(127,29,29,0.12)'
  },
  dangerTitle: {
    color: '#FCA5A5',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700'
  },
  dangerText: {
    color: 'rgba(252,165,165,0.78)',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444'
  },
  deleteButtonText: {
    color: '#FCA5A5',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600'
  },
  sheetContainer: {
    paddingHorizontal: 20
  },
  sheetContent: {
    paddingTop: 20,
    paddingBottom: 30,
    gap: 12
  },
  sheetEyebrow: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700'
  },
  sheetDescription: {
    color: 'rgba(255,255,255,0.68)',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  memberCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#11150B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  memberIdentity: {
    flex: 1,
    gap: 4
  },
  memberMeta: {
    color: 'rgba(255,255,255,0.54)',
    fontFamily: 'Inter',
    fontSize: 12
  },
  memberActions: {
    alignItems: 'flex-end',
    gap: 8
  },
  removeAccessButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.22)'
  },
  removeAccessButtonText: {
    color: '#FCA5A5',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600'
  }
})
