type ReadOnlyRegisterResult = {
  name: string
  value: string
  error?: string | null
  onChange?: (e: unknown) => void
}

export const toReadOnlyFieldProps = (
  registerResult: ReadOnlyRegisterResult
) => ({
  name: registerResult.name,
  value: registerResult.value
})
