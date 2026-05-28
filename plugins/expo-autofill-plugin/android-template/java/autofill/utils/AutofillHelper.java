package com.pears.pass.autofill.utils;

import android.app.assist.AssistStructure;
import android.os.Build;
import android.text.InputType;
import android.util.Pair;
import android.view.ViewStructure;
import android.view.autofill.AutofillId;

import androidx.annotation.RequiresApi;

import java.util.ArrayList;
import java.util.List;

@RequiresApi(api = Build.VERSION_CODES.O)
public class AutofillHelper {
    private static final String TAG = "AutofillHelper";

    private static final String[] USERNAME_HINTS = {"email", "phone", "username", "user", "mobile", "login"};
    private static final String[] PASSWORD_HINTS = {"password", "pswd", "pwd"};
    private static final String[] IGNORED_HINTS = {"search", "find", "recipient", "edit"};

    private static final String[] CARD_NUMBER_KEYWORDS = {"cardnumber", "ccnumber", "cc-number", "card-number", "creditcard"};
    private static final String[] CARD_EXPIRY_KEYWORDS = {"expir", "exp-date", "cc-exp", "ccexp"};
    private static final String[] CARD_EXPIRY_MONTH_KEYWORDS = {"exp-month", "expmonth", "cc-exp-month", "ccexpmonth"};
    private static final String[] CARD_EXPIRY_YEAR_KEYWORDS = {"exp-year", "expyear", "cc-exp-year", "ccexpyear"};
    private static final String[] CARD_SECURITY_KEYWORDS = {"cvc", "cvv", "csc", "securitycode", "security-code", "cardcode"};
    private static final String[] CARDHOLDER_KEYWORDS = {"ccname", "cc-name", "cardholder", "card-holder", "cardholdername", "nameoncard"};

    public static class ParsedFields {
        private AutofillId usernameId;
        private AutofillId passwordId;
        private AutofillId cardNumberId;
        private AutofillId cardExpiryDateId;
        private AutofillId cardExpiryMonthId;
        private AutofillId cardExpiryYearId;
        private AutofillId cardSecurityCodeId;
        private AutofillId cardholderNameId;
        private String packageName;
        private String webDomain;
        private final List<AutofillId> fallbackFieldIds = new ArrayList<>();

        public boolean hasUsernameField() {
            return usernameId != null;
        }

        public boolean hasPasswordField() {
            return passwordId != null;
        }

        public boolean hasCardField() {
            return cardNumberId != null
                    || cardExpiryDateId != null
                    || cardExpiryMonthId != null
                    || cardExpiryYearId != null
                    || cardSecurityCodeId != null
                    || cardholderNameId != null;
        }

        public AutofillId getUsernameId() {
            return usernameId;
        }

        public AutofillId getPasswordId() {
            return passwordId;
        }

        public AutofillId getCardNumberId() { return cardNumberId; }
        public AutofillId getCardExpiryDateId() { return cardExpiryDateId; }
        public AutofillId getCardExpiryMonthId() { return cardExpiryMonthId; }
        public AutofillId getCardExpiryYearId() { return cardExpiryYearId; }
        public AutofillId getCardSecurityCodeId() { return cardSecurityCodeId; }
        public AutofillId getCardholderNameId() { return cardholderNameId; }

        public String getPackageName() {
            return packageName;
        }

        public String getWebDomain() {
            return webDomain;
        }

        /**
         * Returns true if any editable text fields were found, even if they
         * couldn't be classified as username or password fields.
         */
        public boolean hasAnyFallbackField() {
            return !fallbackFieldIds.isEmpty();
        }

        public List<AutofillId> getFallbackFieldIds() {
            return fallbackFieldIds;
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

        if (autofillId != null && isCardNumberField(autofillHints, node) && fields.cardNumberId == null) {
            fields.cardNumberId = autofillId;
            SecureLog.d(TAG, "Found card number field");
        } else if (autofillId != null && isCardExpiryMonthField(autofillHints, node) && fields.cardExpiryMonthId == null) {
            fields.cardExpiryMonthId = autofillId;
            SecureLog.d(TAG, "Found card expiry month field");
        } else if (autofillId != null && isCardExpiryYearField(autofillHints, node) && fields.cardExpiryYearId == null) {
            fields.cardExpiryYearId = autofillId;
            SecureLog.d(TAG, "Found card expiry year field");
        } else if (autofillId != null && isCardExpiryDateField(autofillHints, node) && fields.cardExpiryDateId == null) {
            fields.cardExpiryDateId = autofillId;
            SecureLog.d(TAG, "Found card expiry date field");
        } else if (autofillId != null && isCardSecurityCodeField(autofillHints, node) && fields.cardSecurityCodeId == null) {
            fields.cardSecurityCodeId = autofillId;
            SecureLog.d(TAG, "Found card security code field");
        } else if (autofillId != null && isCardholderNameField(autofillHints, node) && fields.cardholderNameId == null) {
            fields.cardholderNameId = autofillId;
            SecureLog.d(TAG, "Found cardholder name field");
        } else if (autofillId != null && isUsernameField(autofillHints, inputType, node) && fields.usernameId == null) {
            fields.usernameId = autofillId;
            SecureLog.d(TAG, "Found username field");
        } else if (autofillId != null && isPasswordField(autofillHints, inputType, node) && fields.passwordId == null) {
            fields.passwordId = autofillId;
            SecureLog.d(TAG, "Found password field");
        } else if (autofillId != null && isEditableTextField(inputType, node)) {
            // Collect any editable text field as a fallback target.
            // On first page load, browsers may not fully populate the AssistStructure
            // (missing HTML attributes, generic inputType), causing specific field detection
            // to fail. These fallback IDs ensure we still show the PearPass suggestion.
            fields.fallbackFieldIds.add(autofillId);
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

    private static boolean matchesCardSignal(String[] hints, AssistStructure.ViewNode node,
                                             String androidHint, String[] htmlAutocompleteValues,
                                             String[] keywords) {
        if (hints != null) {
            for (String h : hints) {
                if (h == null) continue;
                if (androidHint != null && androidHint.equalsIgnoreCase(h)) return true;
                String hLower = h.toLowerCase();
                if (htmlAutocompleteValues != null) {
                    for (String v : htmlAutocompleteValues) {
                        if (hLower.equals(v)) return true;
                    }
                }
            }
        }

        String autocomplete = getHtmlAttributeValue(node, "autocomplete");
        if (autocomplete != null) {
            String lower = autocomplete.toLowerCase();
            if (htmlAutocompleteValues != null) {
                for (String v : htmlAutocompleteValues) {
                    if (lower.equals(v) || lower.endsWith(" " + v)) return true;
                }
            }
        }

        String hintText = node.getHint() != null ? node.getHint().toString().toLowerCase() : "";
        String idEntry = node.getIdEntry() != null ? node.getIdEntry().toLowerCase() : "";
        String name = getHtmlAttributeValue(node, "name");
        String nameLower = name != null ? name.toLowerCase() : "";

        return containsAnyTerm(hintText, keywords)
                || containsAnyTerm(idEntry, keywords)
                || containsAnyTerm(nameLower, keywords);
    }

    private static boolean isCardNumberField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                android.view.View.AUTOFILL_HINT_CREDIT_CARD_NUMBER,
                new String[]{"cc-number"},
                CARD_NUMBER_KEYWORDS);
    }

    private static boolean isCardExpiryDateField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                android.view.View.AUTOFILL_HINT_CREDIT_CARD_EXPIRATION_DATE,
                new String[]{"cc-exp"},
                CARD_EXPIRY_KEYWORDS);
    }

    private static boolean isCardExpiryMonthField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                android.view.View.AUTOFILL_HINT_CREDIT_CARD_EXPIRATION_MONTH,
                new String[]{"cc-exp-month"},
                CARD_EXPIRY_MONTH_KEYWORDS);
    }

    private static boolean isCardExpiryYearField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                android.view.View.AUTOFILL_HINT_CREDIT_CARD_EXPIRATION_YEAR,
                new String[]{"cc-exp-year"},
                CARD_EXPIRY_YEAR_KEYWORDS);
    }

    private static boolean isCardSecurityCodeField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                android.view.View.AUTOFILL_HINT_CREDIT_CARD_SECURITY_CODE,
                new String[]{"cc-csc"},
                CARD_SECURITY_KEYWORDS);
    }

    private static boolean isCardholderNameField(String[] hints, AssistStructure.ViewNode node) {
        return matchesCardSignal(hints, node,
                null,
                new String[]{"cc-name"},
                CARDHOLDER_KEYWORDS);
    }

    private static String getHtmlAttributeValue(AssistStructure.ViewNode node, String attrName) {
        ViewStructure.HtmlInfo htmlInfo = node.getHtmlInfo();
        if (htmlInfo == null) return null;
        List<Pair<String, String>> attrs = htmlInfo.getAttributes();
        if (attrs == null) return null;
        return getHtmlAttribute(attrs, attrName);
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

    /**
     * Check if a node is an editable single-line text field (potential fill target).
     * Used as fallback when specific username/password detection fails.
     */
    private static boolean isEditableTextField(int inputType, AssistStructure.ViewNode node) {
        if (containsIgnoredHints(node)) {
            return false;
        }

        if (inputType == 0) {
            return false;
        }

        int inputClass = inputType & InputType.TYPE_MASK_CLASS;
        if (inputClass != InputType.TYPE_CLASS_TEXT) {
            return false;
        }

        // Reject multi-line fields (text areas, comment boxes)
        boolean isMultiline = (inputType & InputType.TYPE_TEXT_FLAG_MULTI_LINE) != 0;
        return !isMultiline;
    }
}
