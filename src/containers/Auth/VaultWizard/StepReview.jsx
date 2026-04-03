import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

import { ButtonPrimary, ButtonSecondary } from '../../../libComponents'

export const StepReview = ({ vaultData, onCreate, onBack }) => {
  const { t } = useLingui()
  const hasVaultPassword =
    PROTECTED_VAULT_ENABLED &&
    vaultData.usePassword &&
    vaultData.password.length > 0

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerBlock}>
            <Text style={styles.stepIndicator}>{t`STEP 3 OF 3`}</Text>
            <View style={styles.progressTrack}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={[styles.progressSegment, styles.progressSegmentActive]}
                />
              ))}
            </View>
            <Text style={styles.title}>{t`Review & Create`}</Text>
            <Text style={styles.subtitle}>
              {t`Confirm the vault identity and the protection level before you create it.`}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>{t`Vault Identity`}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t`Vault name`}</Text>
              <Text style={styles.summaryValue}>{vaultData.name}</Text>
            </View>
            {PROTECTED_VAULT_ENABLED && (
              <>
                <View style={styles.summaryDivider} />
                <Text style={styles.sectionTitle}>{t`Security Layer`}</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t`Vault protection`}</Text>
                  <Text style={styles.summaryValue}>
                    {hasVaultPassword
                      ? t`Vault password enabled`
                      : t`Master password only`}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t`Unlock flow`}</Text>
                  <Text style={styles.summaryValue}>
                    {hasVaultPassword
                      ? t`Master password + vault password`
                      : t`Master password`}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{t`Security note`}</Text>
            <Text style={styles.noticeText}>
              {hasVaultPassword
                ? t`This vault will require its own password before it can be opened on a new device.`
                : t`You can add a dedicated vault password later from Vault Settings if the security profile changes.`}
            </Text>
          </View>

          <View style={styles.checklistCard}>
            <Text style={styles.sectionTitle}>{t`Before you continue`}</Text>
            {[
              t`The vault name is clear and easy to identify`,
              hasVaultPassword
                ? t`The vault password is strong and memorable`
                : t`This vault is ready without an extra password`,
              t`You can rename or update the password later from vault settings`
            ].map((item) => (
              <View key={item.id || item} style={styles.checklistRow}>
                <View style={styles.checklistDot} />
                <Text style={styles.checklistText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttons}>
            <ButtonPrimary
              stretch
              onPress={onCreate}
              testID="create-vault-button"
            >
              {t`Create Vault`}
            </ButtonPrimary>
            <ButtonSecondary stretch onPress={onBack}>
              {t`Back`}
            </ButtonSecondary>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  formContainer: {
    width: '100%',
    gap: 20
  },
  headerBlock: { gap: 10 },
  stepIndicator: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 8
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)'
  },
  progressSegmentActive: {
    backgroundColor: colors.primary400?.mode1 || '#A3E635'
  },
  title: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#15180E',
    borderRadius: 22,
    padding: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  sectionTitle: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.62)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    flex: 1
  },
  summaryValue: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  noticeCard: {
    borderRadius: 22,
    padding: 18,
    gap: 8,
    backgroundColor: 'rgba(163,230,53,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(163,230,53,0.24)'
  },
  noticeTitle: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700'
  },
  noticeText: {
    color: 'rgba(255,255,255,0.74)',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20
  },
  checklistCard: {
    borderRadius: 22,
    padding: 18,
    gap: 12,
    backgroundColor: '#10130A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  checklistDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primary400?.mode1 || '#A3E635',
    marginTop: 6
  },
  checklistText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20
  },
  buttons: { width: '100%', gap: 10, marginTop: 8 }
})
