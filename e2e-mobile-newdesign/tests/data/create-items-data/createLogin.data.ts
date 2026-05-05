export const CREATE_LOGIN_PAGE = {
  title: 'New Login Item',
  titleField: {
    title: 'Title',
    inputPlaceholder: 'Enter Title',
    requiredErrorMessage: 'Title is required',
  },
  credentials: {
    title: 'Credentials',
    emailUsernameField: {
      title: 'Email / Username',
      inputPlaceholder: 'Enter Email / Username',
    },
    passwordField: {
      title: 'Password',
      inputPlaceholder: 'Enter Password',
    },
    generatePasswordButton: {
      text: 'Generate Password',
    },
  },
  details: {
    title: 'Details',
    websiteField: {
      title: 'Website',
      inputPlaceholder: 'Enter Website',
    },
    addAnotherWebsiteButton: {
      text: 'Add Another Website',
    },
    folderField: {
      title: 'Folder',
      chooseFolderText: 'Choose Folder',
    },
    addAnotherFolderButton: {
      text: 'Add Another Folder',
    },
  },
  additional: {
    title: 'Additional',
    commentField: {
      title: 'Comment',
      inputPlaceholder: 'Enter Comment',
    },
    hiddenMessagesField: {
      title: 'Hidden Message',
      inputPlaceholder: 'Enter Hidden Message',
    },
    addAnotherMessageButton: {
      text: 'Add Another Message',
    },
  },
  foldersPopup: {
    title: 'Folders',
    addNewFolder: {
      text: 'Add New Folder',
    },
    testFolder: {
      text: 'Test Folder',
      itemsCount: '0 items',
    },
  },
  testFolderActionsPopup: {
    title: 'Test Folder',
    rename: {
      text: 'Rename',
    },
    deleteFolder: {
      text: 'Delete Folder',
    },
  },
  renameFolderPage: {
    title: 'Rename Folder',
    nameField: {
      title: 'Folder Name',
      currentName: 'Test Folder',
    },
    saveButton: {
      text: 'Save',
    },
  },
  createNewFolderPage: {
    title: 'Create New Folder',
    nameField: {
      title: 'Folder Name',
      inputPlaceholder: 'Enter name',
    },
    createNewFolderButton: {
      text: 'Create New Folder',
    },
  },
  addItemButton: {
    text: 'Add Item',
  },
} as const;
