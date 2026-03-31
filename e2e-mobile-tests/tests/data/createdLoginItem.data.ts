/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Copy Email or username row)
  ===================================================== */

export const COPY_EMAIL_OR_USERNAME_BUTTON = {
  text: 'Copy Email or username',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Copy Password row)
  ===================================================== */

export const COPY_PASSWORD_BUTTON = {
  text: 'Copy Password',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Mark as favorite row)
  ===================================================== */

export const MARK_AS_FAVORITE_BUTTON = {
  text: 'Mark as favorite',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Edit row)
  ===================================================== */

export const EDIT_BUTTON = {
  text: 'Edit',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Delete element row)
  ===================================================== */

export const DELETE_ELEMENT_BUTTON = {
  text: 'Delete element',
} as const;

/* =====================================================
        DELETE POPUP
  ===================================================== */

export const DELETE_POPUP = {
  title: 'Delete item',
  text: 'Are you sure that you want to delete this item?',
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Remove from Favorites row)
  ===================================================== */

export const REMOVE_FROM_FAVORITES_BUTTON = {
  text: 'Remove from Favorites',
} as const;

/* =====================================================
        CREATED LOGIN - THREE DOTS POPUP (Move to another folder row)
  ===================================================== */

export const MOVE_TO_ANOTHER_FOLDER_BUTTON = {
  text: 'Move to another folder',
} as const;

/* =====================================================
        MOVE TO ANOTHER FOLDER POPUP - Create new folder button
  ===================================================== */

export const CREATE_NEW_FOLDER_BUTTON = {
  text: 'Create new',
} as const;

/* =====================================================
        MOVE TO ANOTHER FOLDER POPUP - Test folder on login item page
  ===================================================== */

export const TEST_FOLDER_ON_LOGIN_ITEM_PAGE = {
  title: 'TestFolder3',
} as const;

/* =====================================================
        MOVE TO ANOTHER FOLDER POPUP - New folder row in popup menu
  ===================================================== */

export const NEW_FOLDER_IN_POPUP_MENU = {
  title: 'TestFolder3',
} as const;

/* =====================================================
        LOGIN ITEM PAGE - Edit button
  ===================================================== */

export const EDIT_BUTTON_LOGIN_ITEM_PAGE = {
  text: 'Edit',
} as const;

/* =====================================================
        LOGIN ITEM PAGE - Copy button by field type
  ===================================================== */

export const LoginItemCopyField = {
  EmailOrUserName: 'EmailOrUserName',
  Password: 'Password',
  Website: 'Website',
  Note: 'Note',
} as const;

export type LoginItemCopyFieldType = (typeof LoginItemCopyField)[keyof typeof LoginItemCopyField];

/* =====================================================
        LOGIN ITEM PAGE - Copy toast
  ===================================================== */

export const COPY_TOAST_LOGIN_ITEM_PAGE = {
  text: 'Copied!',
} as const;

/* =====================================================
        OPENED FILE POPUP (file preview)
  ===================================================== */

export const OPENED_FILE_POPUP = {
  title: 'owners-manual.pdf',
  quickShareButtonText: 'Quick Share',
} as const;

/* =====================================================
        LOGIN ITEM PAGE - Password visibility (shown / hidden)
  ===================================================== */

export const PasswordVisibility = {
  shown: 'shown',
  hidden: 'hidden',
} as const;

export type PasswordVisibilityType = (typeof PasswordVisibility)[keyof typeof PasswordVisibility];
