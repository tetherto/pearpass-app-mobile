/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@tetherto/pear-apps-lib-ui-react-hooks' {
  import type * as React from 'react'

  type ArrayItem<T> = T extends Array<infer U> ? U : never

  interface RegisteredField<TValue = any> {
    name: string
    value: TValue
    error?: string | null
    onChange: (event: unknown) => void
  }

  interface RegisteredArrayField<TItem = any> {
    value: TItem[]
    addItem: (item: TItem) => void
    removeItem: (index: number) => void
    registerItem: (itemName: string, index: number) => RegisteredField<any>
  }

  interface UseFormParams<TValues extends Record<string, any>> {
    initialValues?: TValues
    validate?: (values: TValues) => string | Record<string, unknown> | null
  }

  interface UseFormResult<TValues extends Record<string, any>> {
    values: TValues
    errors: Record<string, any>
    hasErrors: boolean
    setValues: React.Dispatch<React.SetStateAction<TValues>>
    setValue: (name: keyof TValues | string, value: any) => void
    register: <K extends keyof TValues>(name: K | string) => RegisteredField<TValues[K]>
    handleSubmit: (
      callback: (values: TValues) => void | Promise<void>
    ) => (event?: unknown) => void
    setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>
    registerArray: <K extends keyof TValues>(name: K | string) => RegisteredArrayField<ArrayItem<TValues[K]>>
  }

  export function useForm(params: {
    initialValues?: Record<string, any>
    validate?: (values: Record<string, any>) => string | Record<string, unknown> | null
  }): UseFormResult<Record<string, any>>

  export function useForm<TValues extends Record<string, any>>(
    params: UseFormParams<TValues>
  ): UseFormResult<TValues>

  export function useCountDown(...args: any[]): any
}