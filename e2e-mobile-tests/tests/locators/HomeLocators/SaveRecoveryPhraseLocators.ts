const saveRecoveryPhraseLocators = {
/* =====================================================
        APPLICATION NAME FIELD
===================================================== */
    applicationNameField: '~Application name field',
    applicationNameFieldIcon: '//android.view.ViewGroup[@content-desc="Application name field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    applicationNameFieldTitle: '//android.widget.TextView[@text=" Application "]',
    applicationNameFieldInput: '~Application name input field',
/* =====================================================
        RECOVERY PHRASE FIELD
===================================================== */
    recoveryPhraseField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
    recoveryPhraseFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    recoveryPhraseFieldTitle: '//android.widget.TextView[@text="Recovery phrase"]',

    pasteFromClipboardButton: '~Paste from clipboard',
    pasteFromClipboardIcon: '//android.view.ViewGroup[@content-desc="Paste from clipboard"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    pasteFromClipboardText: '//android.widget.TextView[@text="Paste from clipboard"]',

    pasteFromClipboardWarningMessage: '//android.view.ViewGroup[@resource-id="toastContentContainer"]',
    pasteFromClipboardWarningMessageText: '//android.widget.TextView[@resource-id="toastText1"]',

    recoveryPhrasePastedToastMessage: '//android.view.ViewGroup[@resource-id="toastAnimatedContainer"]/android.view.ViewGroup',
    recoveryPhrasePastedToastMessageText: '//android.widget.TextView[@text="Pasted from clipboard!"]',
    recoveryPhrasePastedToastMessage2Text: '//android.widget.Toast[@text="PearPass pasted from your clipboard"]',


    firstPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
    firstPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#1"]',
    firstPastedRecoveryPhraseText: '//android.widget.TextView[@text="Val"]',

    secondPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
    secondPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#2"]',
    secondPastedRecoveryPhraseText: '//android.widget.TextView[@text="Vall"]',

    thirdPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    thirdPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#3"]',
    thirdPastedRecoveryPhraseText: '//android.widget.TextView[@text="Valeron"]',

    fourthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
    fourthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#4"]',
    fourthPastedRecoveryPhraseText: '//android.widget.TextView[@text="Valerik"]',

    fifthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[7]',
    fifthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#5"]',
    fifthPastedRecoveryPhraseText: '//android.widget.TextView[@text="Valodia"]',

    sixthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
    sixthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#6"]',
    sixthPastedRecoveryPhraseText: '//android.widget.TextView[@text="Eeee"]',

    seventhPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    seventhPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#7"]',
    seventhPastedRecoveryPhraseText: '//android.widget.TextView[@text="Ffasda"]',

    eighthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[10]',
    eighthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#8"]',
    eighthPastedRecoveryPhraseText: '//android.widget.TextView[@text="wewqe"]',

    ninthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[11]',
    ninthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#9"]',
    ninthPastedRecoveryPhraseText: '//android.widget.TextView[@text="qweqwe"]',

    tenthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[12]',
    tenthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#10"]',
    tenthPastedRecoveryPhraseText: '//android.widget.TextView[@text="ewqe"]',

    eleventhPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[13]',
    eleventhPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#11"]',
    eleventhPastedRecoveryPhraseText: '//android.widget.TextView[@text="ewqeqw"]',

    twelfthPastedRecoveryPhrase: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[14]',
    twelfthPastedRecoveryPhraseNumber: '//android.widget.TextView[@text="#12"]',
    twelfthPastedRecoveryPhraseText: '//android.widget.TextView[@text="qweq"]',

    typeField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
    typeFieldText: '//android.widget.TextView[@text="Type"]',
    twelveWordsRadioButton: '~12 words',
    twelveWordsRadioButtonIcon: '//android.view.ViewGroup[@content-desc="12 words"]/android.view.ViewGroup[1]',
    twelveWordsRadioButtonText: '//android.widget.TextView[@text="12 words"]',
    twelveWordsRadioButtonChosen: '//android.view.ViewGroup[@content-desc="12 words"]/android.view.ViewGroup[2]',
    twelveWordsRadioButtonUnchosen: '//android.view.ViewGroup[@content-desc="12 words"]/android.view.ViewGroup',

    twentyFourWordsRadioButton: '~24 words',
    twentyFourWordsRadioButtonIcon: '//android.view.ViewGroup[@content-desc="24 words]/android.view.ViewGroup[1]',
    twentyFourWordsRadioButtonText: '//android.widget.TextView[@text="24 words"]',
    twentyFourWordsRadioButtonChosen: '//android.view.ViewGroup[@content-desc="24 words"]/android.view.ViewGroup[2]',
    twentyFourWordsRadioButtonUnchosen: '//android.view.ViewGroup[@content-desc="24 words"]/android.view.ViewGroup',

    randomWordsToggleText: '//android.widget.TextView[@text="+1 random word"]',
    randomWordsToggleOn: '~Add one random word toggle on',
    randomWordsToggleOff: '~Add one random word toggle off',

/* =====================================================
        NOTE FIELD
===================================================== */
    noteField: '~Note field',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc="Note field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    noteFieldInput: '~Note input field',
    noteFieldContextMenuThreeDots: '~More options',
    selectAllMenuItem: '//android.widget.TextView[@text="Select all"]',
    copyMenuItem: '//android.widget.TextView[@text="Copy"]',
/* =====================================================
        CUSTOM FIELD
===================================================== */
    customField: '~Create custom field',
    createCustomFieldButton: '~Create Custom',
    customFieldIcon: '~Create custom field plus icon',
    customFieldTitle: '~Create custom field text',
    customFieldIcon2: '~Expand create custom field button',

    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Comment"]',

    newNoteField: '//android.view.ViewGroup[@content-desc="New comment input field"]',
    newNoteFieldIcon: '//android.view.ViewGroup[@content-desc="New comment input field"]/com.horcrux.svg.SvgView',
    newNoteFieldTitle: '(//android.widget.TextView[@text=" Comment "])[2]',
    newNoteFieldInput: '//android.widget.EditText[@content-desc="New comment input field"]',
    newNoteFieldDeleteButton: '~Delete new comment field button',
}
export default saveRecoveryPhraseLocators;