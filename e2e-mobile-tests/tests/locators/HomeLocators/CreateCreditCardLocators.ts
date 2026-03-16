const createCreditCardLocators = {
/* =====================================================
        TITLE FIELD
===================================================== */
    titleField: '~Title field',
    titleFieldTitle: '//android.widget.TextView[@text=" Title "]',
    titleFieldInput: '~Title input field',
/* =====================================================
        NAME ON CARD FIELD
===================================================== */
    nameOnCardField: '~Name on card field',
    nameOnCardFieldIcon: '//android.view.ViewGroup[@content-desc="Name on card field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    nameOnCardFieldTitle: '//android.widget.TextView[@text=" Name on card "]',
    nameOnCardFieldInput: '~Name on card input field',
/* =====================================================
        NUMBER ON CARD FIELD
===================================================== */
    numberOnCardField: '~Number on card field',
    numberOnCardFieldIcon: '//android.view.ViewGroup[@content-desc="Number on card field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    numberOnCardFieldTitle: '//android.widget.TextView[@text=" Number on card "]',
    numberOnCardFieldInput: '~Number on card input field',
/* =====================================================
        EXPIRY DATE FIELD
===================================================== */
    expiryDateField: '~Date of expire field',
    expiryDateFieldIcon: '//android.view.ViewGroup[@content-desc="Date of expire field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    expiryDateFieldTitle: '//android.widget.TextView[@text=" Date of expire "]',
    expiryDateFieldInput: '~Date of expire input field',
/* =====================================================
        SECURITY CODE FIELD
===================================================== */
    securityCodeField: '~Security code field',
    securityCodeFieldIcon: '//android.view.ViewGroup[@content-desc="Security code field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    securityCodeFieldTitle: '//android.widget.TextView[@text=" Security code "]',
    securityCodeFieldInput: '~Security doe input field',
    showSecurityCodeIconButton: '//android.view.ViewGroup[@content-desc="Security code field"]/android.view.ViewGroup/com.horcrux.svg.SvgView',
/* =====================================================
        PIN CODE FIELD
===================================================== */
    pinCodeField: '~Pin code field',
    pinCodeFieldIcon: '//android.view.ViewGroup[@content-desc="Pin code field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    pinCodeFieldTitle: '//android.widget.TextView[@text=" Pin code "]',
    pinCodeFieldInput: '~Pin code input field',
    showPinCodeIconButton: '//android.view.ViewGroup[@content-desc="Pin code field"]/android.view.ViewGroup/com.horcrux.svg.SvgView',
/* =====================================================
        FILE FIELD
===================================================== */
    fileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[6]',
    fileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    fileFieldTitle: '//android.widget.TextView[@text="File"]',
    fileFieldText: '//android.widget.TextView[@text="Add file"]',
    addFileButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]/com.horcrux.svg.SvgView',
/* =====================================================
        NOTE FIELD
===================================================== */
    noteField: '~Note field',
    noteFieldIcon: '//android.view.ViewGroup[@content-desc="Note field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    noteFieldTitle: '//android.widget.TextView[@text=" Comment "]',
    noteFieldInput: '~Note input field',
/* =====================================================
        CUSTOM FIELD
===================================================== */
    customFields: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[9]',
    customFieldsIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldsIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsText: '//android.widget.TextView[@text="Create Custom"]',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Comment"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Comment"]',

    testDocumentFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="Test.docx"]',
    largeTestFile: '//android.widget.TextView[@resource-id="android:id/title" and @text="LargeFile.pdf"]',

    warningMessageText: `//android.widget.TextView[@text="Your file is too large. Please upload one that’s 6 MB or smaller."]`,
    warningMessageIcon: '(//android.widget.SeekBar[@content-desc="Bottom Sheet"])[2]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',

    newFileField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[8]',
    newFileFieldIcon: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    newFileFieldTitle: '(//android.widget.TextView[@text="File"])[2]',
    newFileFieldText: '//android.widget.TextView[@text="Test.docx"]',
    newFileFieldDeleteButton: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[10]/com.horcrux.svg.SvgView',

}
export default createCreditCardLocators;