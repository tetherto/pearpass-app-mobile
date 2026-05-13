declare module '@tetherto/pear-apps-utils-validator' {
  export class Validator {
    constructor(type: string, objectSchema?: Record<string, Validator>)

    required(message?: string): this
    minLength(length: number, message?: string): this
    maxLength(length: number, message?: string): this
    min(value: number, message?: string): this
    max(value: number, message?: string): this
    items(schema: Validator): this
    email(message?: string): this
    website(message?: string): this
    numeric(message?: string): this
    refine(fn: (value: unknown) => string | null): this

    validate(value: unknown): string | Record<string, unknown> | null

    static boolean(): Validator
    static string(): Validator
    static number(): Validator
    static array(): Validator
    static object(schema: Record<string, Validator>): Validator
  }
}
