const createWifiLocators = {
/* =====================================================
        WIFI NAME FIELD
===================================================== */
    wifiNameField: '~Wi-Fi name field',
    wifiNameFieldIcon: '//android.view.ViewGroup[@content-desc="Wi-Fi name field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    wifiNameFieldTitle: '//android.widget.TextView[@text=" Wi-Fi Name "]',
    wifiNameFieldInput: '~Wi-Fi name input field',
/* =====================================================
        WIFI PASSWORD FIELD
===================================================== */
    wifiPasswordField: '~Wi-Fi password field',
    wifiPasswordFieldIcon: '//android.view.ViewGroup[@content-desc="Wi-Fi password field"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    wifiPasswordFieldTitle: '//android.widget.TextView[@text=" Wi-Fi Password "]',
    wifiPasswordFieldInput: '//android.widget.TextView[@text="Insert Wi-Fi Password"]',
    generatePasswordIcon: '//android.view.ViewGroup[@content-desc="Wi-Fi password field"]/android.view.ViewGroup[2]/com.horcrux.svg.SvgView',
    showPasswordIcon: '//android.view.ViewGroup[@content-desc="Wi-Fi password field"]/android.view.ViewGroup[3]/com.horcrux.svg.SvgView',
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
    customField: '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[4]',
    customFieldIcon: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[1]/com.horcrux.svg.GroupView',
    customFieldTitle: '//android.widget.TextView[@text="Create Custom"]',
    customFieldIcon2: '//android.view.ViewGroup[@content-desc="Create Custom"]/com.horcrux.svg.SvgView[2]/com.horcrux.svg.GroupView',
    customFieldsIcon3: '//android.view.ViewGroup[@content-desc="Note"]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    customFieldsText2: '//android.widget.TextView[@text="Note"]',

    newNoteField: '(//android.view.ViewGroup[@content-desc=" Note "])[2]',
    newNoteFieldIcon: '(//android.view.ViewGroup[@content-desc=" Note "])[2]/com.horcrux.svg.SvgView/com.horcrux.svg.GroupView',
    newNoteFieldTitle: '(//android.widget.TextView[@text=" Note "])[2]',
    newNoteFieldInput: '(//android.widget.EditText[@text="Add note"])[2]',
    newNoteFieldDeleteButton: '(//android.view.ViewGroup[@content-desc=" Note "])[2]/android.view.ViewGroup/com.horcrux.svg.SvgView',

}
export default createWifiLocators;
