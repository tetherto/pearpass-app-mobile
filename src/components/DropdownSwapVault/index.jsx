import { useMemo, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  KeyboardArrowBottom,
  UnfoldMoreOutlined,
  Check,
  LockFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { ActivityIndicator, Animated, FlatList, Text } from 'react-native'
import { colors } from 'src/utils/colors'

import {
  ArrowIconWrapper,
  Container,
  CreateVaultButton,
  CreateVaultText,
  Dropdown,
  DropdownItem,
  DropdownItemText,
  DropdownWrapper,
  Wrapper
} from './styles'
import { sortAlphabetically } from '../../utils/sortAlphabetically'

const DURATION = 300

/**
 *
 * @param {{
 * * vaults: any[]
 * * selectedVault: any
 * * onVaultSwap: (vault: any) => void
 * * onCreateVault?: () => void
 * * }} props
 */
export const DropdownSwapVault = ({
  vaults,
  selectedVault,
  onVaultSwap,
  onCreateVault
}) => {
  const { t } = useLingui()
  const [isOpen, setIsOpen] = useState(false)
  const [switchingVault, setSwitchingVault] = useState(null)
  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedOpacity = useRef(new Animated.Value(0)).current

  const sortedVaults = useMemo(() => sortAlphabetically(vaults), [vaults])

  const animateToggle = (isOpen) =>
    new Promise((resolve) => {
      Animated.timing(animatedHeight, {
        toValue: isOpen ? 0 : 1000,
        duration: DURATION,
        useNativeDriver: false
      }).start()

      Animated.timing(animatedOpacity, {
        toValue: isOpen ? 0 : 1,
        duration: DURATION,
        useNativeDriver: false
      }).start(resolve)
    })

  const toggleDropdown = async () => {
    setIsOpen(!isOpen)

    await animateToggle(isOpen)
  }

  const handleVaultSwap = async (vault) => {
    try {
      setSwitchingVault(vault)
      await toggleDropdown()
      await onVaultSwap(vault)
      setSwitchingVault(null)
    } catch {
      setSwitchingVault(null)
    }
  }

  if (!vaults?.length) {
    return null
  }

  const displayVault = switchingVault || selectedVault

  return (
    <Wrapper>
      <Container onPress={toggleDropdown} activeOpacity={1} isOpen={isOpen}>
        {switchingVault ? (
          <ActivityIndicator size="small" color={colors.primary400.mode1} />
        ) : (
          <LockFilled width={21} height={21} color={colors.primary400.mode1} />
        )}
        <Text
          style={{
            color: colors.primary400.mode1,
            flex: 1,
            marginHorizontal: 8
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayVault?.name ?? displayVault?.id}
        </Text>
        <ArrowIconWrapper>
          {isOpen ? (
            <UnfoldMoreOutlined
              width={14}
              height={14}
              color={colors.primary400.mode1}
            />
          ) : (
            <KeyboardArrowBottom
              width={14}
              height={14}
              color={colors.primary400.mode1}
            />
          )}
        </ArrowIconWrapper>
      </Container>
      <DropdownWrapper
        isOpen={isOpen}
        style={{ maxHeight: animatedHeight, opacity: animatedOpacity }}
      >
        <Dropdown>
          <FlatList
            data={sortedVaults}
            keyExtractor={(vault) => vault?.id}
            renderItem={({ item }) => {
              const isSelected = item?.id === selectedVault?.id

              return (
                <DropdownItem
                  onPress={() => !isSelected && handleVaultSwap(item)}
                  activeOpacity={0.7}
                >
                  <DropdownItemText numberOfLines={1} ellipsizeMode="tail">
                    {item?.name ?? item?.id}
                  </DropdownItemText>
                  {isSelected && (
                    <Check
                      width={20}
                      height={20}
                      color={colors.primary400.mode1}
                    />
                  )}
                </DropdownItem>
              )
            }}
            ListFooterComponent={
              onCreateVault ? (
                <CreateVaultButton onPress={onCreateVault} activeOpacity={0.7}>
                  <CreateVaultText>{t`Create New Vault`}</CreateVaultText>
                </CreateVaultButton>
              ) : null
            }
          />
        </Dropdown>
      </DropdownWrapper>
    </Wrapper>
  )
}
