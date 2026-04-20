const createNotesLocators = {
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~Title field',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '~Title input field',
/* =====================================================
        WRITE NOTE FIELD
===================================================== */
    writeNoteField: '~Add note field',
    writeNoteText: '~Add note input field',
/* =====================================================
        ADD FILE FIELD
===================================================== */
    addFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]',
    addFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    addFileFieldTitle: '//android.widget.TextView[@text="File"]',
    addFileFieldInput: '//android.widget.TextView[@text="Add file"]',
    addFileFieldButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]/com.horcrux.svg.SvgView',

    newAddedFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
    newAddedFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    newAddedFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newAddedFileFieldText: '//android.widget.TextView[@text="owners-manual.pdf"]',
    newAddedFileFieldDeleteButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]/com.horcrux.svg.SvgView',
/* =====================================================
        CREATE CUSTOM FIELD
===================================================== */
    customField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
    customFieldIcon: '~Create custom field plus icon',
    customFieldTitle: '~Create custom field text',
    customFieldIcon2: '//android.view.ViewGroup[@content-desc="Expand create custom field button"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView',
    customFieldsText2: '//android.widget.TextView[@text="Comment"]',
    addCommentButton: '~Comment',
    expandCreateCustomFieldButton: '~Expand create custom field button',

    newNoteField: '//android.view.ViewGroup[@content-desc="New comment input field"]',
    newNoteFieldIcon: '//android.view.ViewGroup[@content-desc="New comment input field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newNoteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    newNoteFieldInput: '//android.widget.EditText[@content-desc="New comment input field"]',
    newNoteFieldDeleteButton: '~Delete new comment field button',
}
export default createNotesLocators;
