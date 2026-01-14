import { useMemo } from 'react'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { AUTO_LOCK_TIMEOUT_OPTIONS } from 'pearpass-lib-constants'
import styled from 'styled-components/native'

import { RadioSelect } from '../../components/RadioSelect'

const Container = styled.View`
  padding: 20px;
`

/**
 * @param {object} props
 * @param {number} props.selectedValue
 * @param {(value: number) => void} props.onSelect
 * @returns {JSX.Element}
 */
export const BottomSheetAutoLockContent = ({ selectedValue, onSelect }) => {
  const { t } = useLingui()

  const timeoutOptions = useMemo(
    () =>
      Object.values(AUTO_LOCK_TIMEOUT_OPTIONS).map((option) => ({
        label: t(option.label),
        value: String(option.value)
      })),
    [t]
  )

  const handleChange = (value) => {
    onSelect(Number(value))
  }

  return (
    <BottomSheetView>
      <Container>
        <RadioSelect
          options={timeoutOptions}
          selectedOption={String(selectedValue)}
          onChange={handleChange}
        />
      </Container>
    </BottomSheetView>
  )
}
