package com.noxtton.pearpass.autofill.utils;

import android.app.assist.AssistStructure;
import android.os.Build;
import android.text.InputType;
import android.util.Log;
import android.view.View;
import android.view.autofill.AutofillId;

import androidx.annotation.RequiresApi;

@RequiresApi(api = Build.VERSION_CODES.O)
public class AutofillHelper {
    private static final String TAG = "AutofillHelper";

    private static final String[] USERNAME_HINTS = {"email", "phone", "username", "user", "mobile", "login"};
    private static final String[] PASSWORD_HINTS = {"password", "pswd", "pwd"};
    private static final String[] IGNORED_HINTS = {"search", "find", "recipient", "edit"};

    public static class ParsedFields {
        private AutofillId usernameId;
        private AutofillId passwordId;
        private String packageName;
        private String webDomain;

        public boolean hasUsernameField() {
            return usernameId != null;
        }

        public boolean hasPasswordField() {
            return passwordId != null;
        }

        public AutofillId getUsernameId() {
            return usernameId;
        }

        public AutofillId getPasswordId() {
            return passwordId;
        }

        public String getPackageName() {
            return packageName;
        }

        public String getWebDomain() {
            return webDomain;
        }
    }

    public static ParsedFields parseStructure(AssistStructure structure) {
        if (structure == null) {
            return null;
        }

        ParsedFields fields = new ParsedFields();

        // Extract package name from the structure
        if (structure.getActivityComponent() != null) {
            fields.packageName = structure.getActivityComponent().getPackageName();
            Log.d(TAG, "Extracted package name: " + fields.packageName);
        }

        int nodeCount = structure.getWindowNodeCount();
        for (int i = 0; i < nodeCount; i++) {
            AssistStructure.WindowNode windowNode = structure.getWindowNodeAt(i);
            AssistStructure.ViewNode rootViewNode = windowNode.getRootViewNode();
            parseViewNode(rootViewNode, fields);
        }

        return fields;
    }

    private static void parseViewNode(AssistStructure.ViewNode node, ParsedFields fields) {
        if (node == null) {
            return;
        }

        String[] autofillHints = node.getAutofillHints();
        int inputType = node.getInputType();
        AutofillId autofillId = node.getAutofillId();
        String webDomain = node.getWebDomain();

        if (webDomain != null && fields.webDomain == null) {
            fields.webDomain = webDomain;
        }

        if (autofillId != null && isUsernameField(autofillHints, inputType, node) && fields.usernameId == null) {
            fields.usernameId = autofillId;
            Log.d(TAG, "Found username field");
        } else if (autofillId != null && isPasswordField(autofillHints, inputType, node) && fields.passwordId == null) {
            fields.passwordId = autofillId;
            Log.d(TAG, "Found password field");
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            parseViewNode(node.getChildAt(i), fields);
        }
    }

    private static boolean isUsernameField(String[] hints, int inputType, AssistStructure.ViewNode node) {
        if (containsIgnoredHints(node)) {
            return false;
        }

        // Check autofill hints
        if (hints != null) {
            for (String autofillHint : hints) {
                if (autofillHint != null && containsAnyTerm(autofillHint.toLowerCase(), USERNAME_HINTS)) {
                    return true;
                }
            }
        }

        // Check hint text
        String hintText = node.getHint() != null ? node.getHint().toString().toLowerCase() : "";
        if (containsAnyTerm(hintText, USERNAME_HINTS)) {
            return true;
        }

        // Check field ID
        String idEntry = node.getIdEntry();
        String idEntryLower = idEntry != null ? idEntry.toLowerCase() : "";
        if (containsAnyTerm(idEntryLower, USERNAME_HINTS)) {
            return true;
        }

        // Check HTML info for web content
        if (hasUsernameHtmlHints(node)) {
            return true;
        }

        // Check inputType for web email variation
        int variation = inputType & InputType.TYPE_MASK_VARIATION;
        return variation == InputType.TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS;
    }

    private static boolean isPasswordField(String[] hints, int inputType, AssistStructure.ViewNode node) {
        // Reject fields that are detected as username fields
        if (isUsernameField(hints, inputType, node)) {
            return false;
        }

        if (containsIgnoredHints(node)) {
            return false;
        }

        // Check inputType for password variations
        // Reject multi-line fields as they are likely text areas, not password fields
        boolean hasPasswordVariation = (inputType & InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0 ||
            (inputType & InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD) != 0 ||
            (inputType & InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD) != 0;
        
        if (hasPasswordVariation) {
            boolean isMultiline = (inputType & InputType.TYPE_TEXT_FLAG_MULTI_LINE) != 0;
            if (!isMultiline) {
                return true;
            }
        }

        // Check autofill hints
        if (hints != null) {
            for (String autofillHint : hints) {
                if (autofillHint != null && containsAnyTerm(autofillHint.toLowerCase(), PASSWORD_HINTS)) {
                    return true;
                }
            }
        }

        // Check hint text
        String hintText = node.getHint() != null ? node.getHint().toString().toLowerCase() : "";
        if (containsAnyTerm(hintText, PASSWORD_HINTS)) {
            return true;
        }

        // Check field ID
        String idEntry = node.getIdEntry();
        String idEntryLower = idEntry != null ? idEntry.toLowerCase() : "";
        if (containsAnyTerm(idEntryLower, PASSWORD_HINTS)) {
            return true;
        }

        // Check HTML info for web content
        return hasPasswordHtmlHints(node);
    }

    /**
     * Check if the node contains any ignored hint terms.
     */
    private static boolean containsIgnoredHints(AssistStructure.ViewNode node) {
        String hintText = node.getHint() != null ? node.getHint().toString().toLowerCase() : "";
        String idEntry = node.getIdEntry() != null ? node.getIdEntry().toLowerCase() : "";
        
        return containsAnyTerm(hintText, IGNORED_HINTS) || containsAnyTerm(idEntry, IGNORED_HINTS);
    }

    /**
     * Check if the text contains any of the terms in the array.
     */
    private static boolean containsAnyTerm(String text, String[] terms) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        for (String term : terms) {
            if (text.contains(term)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if the node's HTML info contains username hints.
     */
    private static boolean hasUsernameHtmlHints(AssistStructure.ViewNode node) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return false;
        }
        
        return hasUsernameHtmlHintsApi26(node);
    }
    
    @RequiresApi(api = Build.VERSION_CODES.O)
    private static boolean hasUsernameHtmlHintsApi26(AssistStructure.ViewNode node) {
        try {
            Object htmlInfoObj = node.getHtmlInfo();
            if (htmlInfoObj == null) {
                return false;
            }
            
            // Use reflection to access HtmlInfo methods
            Class<?> htmlInfoClass = htmlInfoObj.getClass();
            java.lang.reflect.Method getAttributeMethod = htmlInfoClass.getMethod("getAttribute", String.class);
            
            // Check HTML input type attribute
            String htmlInputType = (String) getAttributeMethod.invoke(htmlInfoObj, "type");
            if (htmlInputType != null) {
                String htmlInputTypeLower = htmlInputType.toLowerCase();
                if (htmlInputTypeLower.equals("email") || htmlInputTypeLower.equals("tel")) {
                    return true;
                }
            }
            
            // Check autocomplete attribute
            String autocomplete = (String) getAttributeMethod.invoke(htmlInfoObj, "autocomplete");
            if (autocomplete != null && containsAnyTerm(autocomplete.toLowerCase(), USERNAME_HINTS)) {
                return true;
            }
            
            // Check name attribute
            String name = (String) getAttributeMethod.invoke(htmlInfoObj, "name");
            if (name != null && containsAnyTerm(name.toLowerCase(), USERNAME_HINTS)) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Error accessing HTML info", e);
            return false;
        }
    }

    /**
     * Check if the node's HTML info contains password hints.
     */
    private static boolean hasPasswordHtmlHints(AssistStructure.ViewNode node) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return false;
        }
        
        return hasPasswordHtmlHintsApi26(node);
    }
    
    @RequiresApi(api = Build.VERSION_CODES.O)
    private static boolean hasPasswordHtmlHintsApi26(AssistStructure.ViewNode node) {
        try {
            Object htmlInfoObj = node.getHtmlInfo();
            if (htmlInfoObj == null) {
                return false;
            }
            
            // Use reflection to access HtmlInfo methods
            Class<?> htmlInfoClass = htmlInfoObj.getClass();
            java.lang.reflect.Method getAttributeMethod = htmlInfoClass.getMethod("getAttribute", String.class);
            
            // Check HTML input type attribute
            String htmlInputType = (String) getAttributeMethod.invoke(htmlInfoObj, "type");
            if (htmlInputType != null && htmlInputType.equalsIgnoreCase("password")) {
                return true;
            }
            
            // Check autocomplete attribute
            String autocomplete = (String) getAttributeMethod.invoke(htmlInfoObj, "autocomplete");
            if (autocomplete != null && containsAnyTerm(autocomplete.toLowerCase(), PASSWORD_HINTS)) {
                return true;
            }
            
            // Check name attribute
            String name = (String) getAttributeMethod.invoke(htmlInfoObj, "name");
            if (name != null && containsAnyTerm(name.toLowerCase(), PASSWORD_HINTS)) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Error accessing HTML info", e);
            return false;
        }
    }
}
