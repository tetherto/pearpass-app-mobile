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
    newFileFieldText: '//android.view.ViewGroup[@content-desc="owners-manual.pdf"]',
/* =====================================================
        CREATE CUSTOM FIELD
===================================================== */
    createCustomField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]',
    createCustomFieldIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    createCustomFieldTitle: '//android.widget.TextView[@text="Create Custom"]',
    createCustomFieldIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    createCustomFieldIcon3: '//android.view.ViewGroup[@content-desc="Note"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    createCustomFieldText2: '//android.widget.TextView[@text="Note"]',

    }
export default createCustomElementLocators;