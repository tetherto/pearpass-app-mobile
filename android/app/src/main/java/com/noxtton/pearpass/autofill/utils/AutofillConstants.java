package com.noxtton.pearpass.autofill.utils;

/**
 * Constants used throughout the autofill extension.
 * Centralizes hardcoded values for easier maintenance.
 */
public final class AutofillConstants {

    private AutofillConstants() {
        // Prevent instantiation
    }

    /**
     * Placeholder value shown for password fields in autofill suggestions
     */
    public static final String PLACEHOLDER_PASSWORD = "●●●●●●●●";

    /**
     * Default unknown credential name when no name is available
     */
    public static final String UNKNOWN_CREDENTIAL = "Unknown";

    /**
     * Date format pattern used for displaying vault dates
     */
    public static final String DATE_FORMAT_PATTERN = "dd/MM/yyyy";
    
    /**
     * The autofill service class name as declared in AndroidManifest.xml
     */
    public static final String AUTOFILL_SERVICE_CLASS = ".autofill.service.PearPassAutofillService";
}
