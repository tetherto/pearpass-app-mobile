import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { AUTO_LOCK_TIMEOUT_OPTIONS, DEFAULT_AUTO_LOCK_TIMEOUT } from 'pearpass-lib-constants'
import { ArrowDownIcon } from 'pearpass-lib-ui-react-native-components'

import { BottomSheetAutoLockContent } from './BottomSheetContent'
import {
  Container,
  Description,
  SettingLabel,
  SettingRow,
  TimeoutSelector,
  TimeoutText
} from './styles'
import { AppSwitch } from '../../components/AppSwitch/AppSwitch'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'

export const AutoLockSettings = () => {
  const { t } = useLingui()
  const { expand, collapse } = useBottomSheet()
  const { autoLockTimeout, setAutoLockTimeout, isAutoLockEnabled } =
    useAutoLockContext()

  const currentTimeoutLabel = useMemo(() => {
    const option = Object.values(AUTO_LOCK_TIMEOUT_OPTIONS).find(
      (opt) => opt.value === autoLockTimeout
    )
    return option ? t(option.label) : ''
  }, [autoLockTimeout, t])

  const handleToggleAutoLock = (enabled) => {
    setAutoLockTimeout(
      enabled ? DEFAULT_AUTO_LOCK_TIMEOUT : null
    )
  }

  const handleTimeoutSelect = (value) => {
    setAutoLockTimeout(value)
    collapse()
  }

  const handleOpenSelector = () => {
    expand({
      children: (
        <BottomSheetAutoLockContent
          selectedValue={autoLockTimeout}
          onSelect={handleTimeoutSelect}
        />
      ),
      snapPoints: ['10%', '40%']
    })
  }

  return (
    <Container>
      <SettingRow>
        <SettingLabel>{t`Auto Log-out`}</SettingLabel>
        <AppSwitch value={isAutoLockEnabled} onChange={handleToggleAutoLock} />
      </SettingRow>
      <Description>
        {t`Automatically logs you out after you stop interacting with the app, based on the timeout you select.`}
      </Description>
      {isAutoLockEnabled && (
        <TimeoutSelector onPress={handleOpenSelector}>
          <TimeoutText>{currentTimeoutLabel}</TimeoutText>
          <ArrowDownIcon size="14" />
        </TimeoutSelector>
      )}
    </Container>
  )
}
