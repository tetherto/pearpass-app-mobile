# Version check behavior by distribution

## Standard / Play Store builds

- Android: version check uses Play Store HTML as the update source.
- If an update is required, the app shows a forced update modal and redirects to the Play Store.

## F-Droid builds

- Android: version check is disabled.
- The forced update modal is not shown.
- The update redirect does not open the Play Store.

