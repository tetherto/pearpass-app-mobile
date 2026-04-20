/* =====================================================
        CREATE CREDIT CARD PAGE - TITLE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_TITLE_FIELD = {
  title: ' Title ',
  inputPlaceholder: 'No title',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - NAME ON CARD FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_NAME_ON_CARD_FIELD = {
  title: ' Name on card ',
  inputPlaceholder: 'John Smith',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - NUMBER ON CARD FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_NUMBER_ON_CARD_FIELD = {
  title: ' Number on card ',
  inputPlaceholder: '1234 1234 1234 1234 ',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - EXPIRY DATE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_EXPIRY_DATE_FIELD = {
  title: ' Date of expire ',
  inputPlaceholder: 'MM YY',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - SECURITY CODE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_SECURITY_CODE_FIELD = {
  title: ' Security code ',
  inputPlaceholder: '123',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - PIN CODE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_PIN_CODE_FIELD = {
  title: ' Pin code ',
  inputPlaceholder: '1234',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - FILE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_FILE_FIELD = {
  title: 'File',
  text: 'Add file',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - NOTE FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_NOTE_FIELD = {
  title: ' Comment ',
  inputPlaceholder: 'Add comment',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - CUSTOM FIELD
  ===================================================== */

export const CREATE_CREDIT_CARD_CUSTOM_FIELD = {
  text: 'Create Custom',
  noteText: 'Comment',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - SHOW CUSTOM FIELD POPUP
  ===================================================== */

export const CREATE_CREDIT_CARD_SHOW_CUSTOM_FIELD_POPUP = {
  noteText: 'Comment',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - NEW FILE FIELD (ADDED FILE)
  ===================================================== */

export const CREATE_CREDIT_CARD_NEW_FILE_FIELD = {
  title: 'File',
  fileName: 'Test.docx',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - WARNING MESSAGE (FILE TOO LARGE)
  ===================================================== */

export const CREATE_CREDIT_CARD_WARNING_MESSAGE = {
  text: `Your file is too large. Please upload one that’s 6 MB or smaller.`,
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - VALIDATION (schema / input handlers)
  ===================================================== */

export const CREATE_CREDIT_CARD_VALIDATION_MESSAGES = {
  /** Shown as toast when Save is tapped with non-numeric security code or pin (CreateOrEditCreditCardContent). */
  numbersOnly: 'Should contain only numbers',
} as const;

/* =====================================================
        CREATE CREDIT CARD PAGE - EXPECTED ENTERED TEXT IN FIELDS
  ===================================================== */

export const CREATE_CREDIT_CARD_ENTERED_FIELDS = {
  title: 'Test Credit Card',
  nameOnCard: 'Ivan Ivanov',
  numberOnCard: '3333 3333 3333 3333',
  expiryDate: '12 25',
  securityCode: '333',
  pinCode: '3333',
  note: 'Test note for credit card',
} as const;
