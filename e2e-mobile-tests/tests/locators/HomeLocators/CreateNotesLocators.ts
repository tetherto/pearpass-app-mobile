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
    customFieldIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldTitle: '//android.widget.TextView[@text="Create Custom"]',
    customFieldIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Note"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Note"]',
}
export default createNotesLocators;
