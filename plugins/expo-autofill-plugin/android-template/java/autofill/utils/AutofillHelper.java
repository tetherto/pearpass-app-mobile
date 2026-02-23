package com.pears.pass.autofill.utils;

import android.app.assist.AssistStructure;
import android.os.Build;
import android.text.InputType;
import android.util.Pair;
import android.view.ViewStructure;
import android.view.autofill.AutofillId;

import androidx.annotation.RequiresApi;

import java.util.List;

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
            SecureLog.d(TAG, "Extracted package name: " + fields.packageName);
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
            SecureLog.d(TAG, "Found username field");
        } else if (autofillId != null && isPasswordField(autofillHints, inputType, node) && fields.passwordId == null) {
            fields.passwordId = autofillId;
            SecureLog.d(TAG, "Found password field");
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
        if (hasUsernameHtmlAttributes(node)) {
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
        return hasPasswordHtmlAttributes(node);
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
     * Check if the node's HTML attributes indicate a username/email field.
     * Inspects type, autocomplete, and name attributes.
     */
    private static boolean hasUsernameHtmlAttributes(AssistStructure.ViewNode node) {
        ViewStructure.HtmlInfo htmlInfo = node.getHtmlInfo();
        if (htmlInfo == null) {
            return false;
        }

        List<Pair<String, String>> attributes = htmlInfo.getAttributes();
        if (attributes == null) {
            return false;
        }

        String htmlInputType = getHtmlAttribute(attributes, "type");
        if (htmlInputType != null) {
            String htmlInputTypeLower = htmlInputType.toLowerCase();
            if (htmlInputTypeLower.equals("email") || htmlInputTypeLower.equals("tel")) {
                return true;
            }
        }

        String autocomplete = getHtmlAttribute(attributes, "autocomplete");
        if (autocomplete != null && containsAnyTerm(autocomplete.toLowerCase(), USERNAME_HINTS)) {
            return true;
        }

        String name = getHtmlAttribute(attributes, "name");
        if (name != null && containsAnyTerm(name.toLowerCase(), USERNAME_HINTS)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the node's HTML attributes indicate a password field.
     * Inspects type, autocomplete, and name attributes.
     */
    private static boolean hasPasswordHtmlAttributes(AssistStructure.ViewNode node) {
        ViewStructure.HtmlInfo htmlInfo = node.getHtmlInfo();
        if (htmlInfo == null) {
            return false;
        }

        List<Pair<String, String>> attributes = htmlInfo.getAttributes();
        if (attributes == null) {
            return false;
        }

        String htmlInputType = getHtmlAttribute(attributes, "type");
        if (htmlInputType != null && htmlInputType.equalsIgnoreCase("password")) {
            return true;
        }

        String autocomplete = getHtmlAttribute(attributes, "autocomplete");
        if (autocomplete != null && containsAnyTerm(autocomplete.toLowerCase(), PASSWORD_HINTS)) {
            return true;
        }

        String name = getHtmlAttribute(attributes, "name");
        if (name != null && containsAnyTerm(name.toLowerCase(), PASSWORD_HINTS)) {
            return true;
        }

        return false;
    }

    /**
     * Get an HTML attribute value by name from the attributes list.
     */
    private static String getHtmlAttribute(List<Pair<String, String>> attributes, String name) {
        for (Pair<String, String> attr : attributes) {
            if (name.equalsIgnoreCase(attr.first)) {
                return attr.second;
            }
        }
        return null;
    }
}
