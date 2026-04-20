const createCustomElementLocators = {
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~Title field',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '~Title input field',
/* =====================================================
        FILE FIELD
===================================================== */
    addFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]',
    addFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    addFileFieldTitle: '//android.widget.TextView[@text="File"]',
    addFileFieldText: '//android.widget.TextView[@text="Add file"]',
    addFileButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]/com.horcrux.svg.SvgView',

    newFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    newFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    newFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newFileFieldText: '//android.widget.TextView[@text="owners-manual.pdf"]',
/* =====================================================
        CREATE CUSTOM FIELD
===================================================== */
    createCustomField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    createCustomFieldIcon: '//android.view.ViewGroup[@content-desc="Expand create custom field button"]/com.horcrux.svg.SvgView[1]',
    createCustomFieldTitle: '~Create custom field text',
    createCustomFieldIcon2: '//android.view.ViewGroup[@content-desc="Expand create custom field button"]/com.horcrux.svg.SvgView[2]',
    createCustomFieldIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    createCustomFieldText2: '//android.widget.TextView[@text="Comment"]',
    createCustomField2: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',

    addCommentButton: '~Comment',
    expandCreateCustomFieldButton: '~Expand create custom field button',

    newNoteField: '//android.view.ViewGroup[@content-desc="New comment input field"]',
    newNoteFieldIcon: '//android.view.ViewGroup[@content-desc="New comment input field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newNoteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    newNoteFieldInput: '//android.widget.EditText[@content-desc="New comment input field"]',
    newNoteFieldDeleteButton: '~Delete new comment field button',
    }
export default createCustomElementLocators;