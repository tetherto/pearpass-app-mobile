import { useCallback, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { Button } from '@tetherto/pearpass-lib-ui-kit'

import { Layout } from '../../containers/Layout'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { ImportPreviewStep } from './ImportPreviewStep'
import { ImportScanStep } from './ImportScanStep'
import { useImportVault } from './useImportVault'

type Step = 'scan' | 'preview'

export const ImportVault = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const [step, setStep] = useState<Step>('scan')
  const [inviteCode, setInviteCode] = useState('')

  const { isLoading, error, pairWithCode, cancelPairing } = useImportVault()

  const navigateToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'MainTabNavigator' }] })
    )
  }, [navigation])

  const handleBack = useCallback(() => {
    if (step === 'preview') {
      navigateToHome()
    } else {
      navigation.goBack()
    }
  }, [step, navigation, navigateToHome])

  const handleCodeScanned = useCallback(
    async (code: string) => {
      setInviteCode(code)
      const success = await pairWithCode(code)
      if (success) {
        setStep('preview')
      }
    },
    [pairWithCode]
  )

  const handleContinue = useCallback(async () => {
    if (inviteCode.trim()) {
      const success = await pairWithCode(inviteCode.trim())
      if (success) {
        setStep('preview')
      }
    }
  }, [inviteCode, pairWithCode])

  const handleGoToVault = useCallback(() => {
    navigateToHome()
  }, [navigateToHome])

  const title = t`Import Vault`

  const footer =
    step === 'scan' ? (
      <Button
        variant="primary"
        size="medium"
        fullWidth
        onClick={isLoading ? cancelPairing : handleContinue}
        disabled={!isLoading && !inviteCode.trim().length}
        isLoading={isLoading}
        data-testid="import-vault-continue-button"
      >
        {isLoading ? t`Cancel Pairing` : t`Continue`}
      </Button>
    ) : (
      <Button
        variant="primary"
        size="medium"
        fullWidth
        onClick={handleGoToVault}
        data-testid="import-vault-save-button"
      >
        {t`Go to Vault`}
      </Button>
    )

  return (
    <Layout
      header={<BackScreenHeader title={title} onBack={handleBack} />}
      footer={footer}
      scrollable
    >
      {step === 'scan' ? (
        <ImportScanStep
          isLoading={isLoading}
          error={error}
          inviteCode={inviteCode}
          setInviteCode={setInviteCode}
          onCodeScanned={handleCodeScanned}
        />
      ) : (
        <ImportPreviewStep error={error} />
      )}
    </Layout>
  )
}
