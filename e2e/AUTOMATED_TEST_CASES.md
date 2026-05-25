# Automated Test Cases

| Suite | Count |
| --- | --- |
| Onboarding | 3 |
| Sign Up | 6 |
| Home | 25 |
| Create Login Item | 15 |
| Settings | 86 |
| **Total** | **135** |

---

## Onboarding (3)

`tests/specs/OnboardingTests.ts`

### Onboarding Flow

1. User should see onboarding screens when opening the app for the first time
2. User is moved to the next screen by tapping Continue button
3. User is moved to Sign-up screen after Onboarding

---

## Sign Up (6)

`tests/specs/SignUpTests.ts`

### Sign In Flow - Create Master Password page

1. User can verify Create Master Password Page with all elements displayed
2. Verify that continue button is disabled by default
3. Verify that hint text is displayed when user tap on enter master password field
4. Verify that Decent password indicator is displayed when user enters too short password
5. Verify that Continue button is enabled when user enters valid password
6. Verify that User can create master password, continue to turn on autofill page

---

## Home (25)

`tests/specs/HomeTests.ts`

### Home Page - Main Navigation (17)

1. Verify that search field with all elements is displayed on Home page
2. Verify that import vault button is displayed on Home page
3. Verify that import items button is displayed on Home page
4. Verify that vault tab and button are displayed on Home page
5. Verify that settings tab is displayed on Home page
6. Verify that add item buttons are displayed on Home page
7. Verify that Folders button is displayed on Home page
8. User can tap on Folders button, see folders popup and close it by clicking on Close button
9. Verify that Items order button is displayed on Home page
10. User can tap on Sort Items button, see Sort Items popup and close it by clicking on Close button
11. User can see Vaults popup by clicking on Vaults button and close it by clicking on Close button
12. User can see vaults popup by long pressing on vaults tab and close it by clicking on Close button
13. User can tap on all items category button, see items category popup and close it by clicking on Close button
14. User can tap on add item button, see add item popup and close it by clicking on Close button
15. User can tap on Import Vault button, see import vault page and close it by clicking on Go back button
16. User can tap on Import Items button, see import items page and close it by clicking on Go back button
17. User can tap on center Add Item button, see Create New Login Item page and close it by clicking on Back button

### Home Page - Add Item (8)

18. User can tap on Add Item button, tap on Logins field, see Logins page and close it by clicking on Back button
19. User can tap on Add Item button, tap on Credit Card field, see Credit Card page and close it by clicking on Back button
20. User can tap on Add Item button, tap on Identities field, see Identities page and close it by clicking on Back button
21. User can tap on Add Item button, tap on Notes field, see Notes page and close it by clicking on Back button
22. User can tap on Add Item button, tap on Recovery Phrases field, see Recovery Phrases page and close it by clicking on Back button
23. User can tap on Add Item button, tap on WiFi field, see WiFi page and close it by clicking on Back button
24. User can tap on Add Item button, tap on Other field, see Other page and close it by clicking on Back button
25. User can tap on Add Item button, tap on Password field, see Password page and close it by clicking on Back button

---

## Create Login Item (15)

`tests/specs/CreateLoginItemTests.ts` — `describe('Home Page - Main Navigation', ...)`

1. Verify that all elements are displayed on Create Login Item page
2. Verify that Add Item button is inactive by default
3. User redirect to New Password Item page when Generate Password button is tapped
4. User can add another Website field when Add Another Website button is tapped
5. User can delete Website field when Delete button is tapped
6. Verify that Folders popup is displayed when User taps on Folder field
7. User can add new folder when Add New Folder button is tapped
8. User can rename Folder field when Rename button is tapped
9. User can delete Folder field when Delete Folder button is tapped
10. User can add file
11. User can delete file when Delete button is tapped
12. User can add Photo/Video
13. User can add Another Hidden Message field when Add Another Message button is tapped
14. User can delete Hidden Message field when Delete button is tapped
15. It is impposible to load file larger than 6MB

---

## Settings (86)

`tests/specs/SettingsTests.ts`

### Settings - Main Page Navigation (2)

1. User should see Settings page with all elements
2. User can show and hide sections

### Security - App Preferences Page (7)

3. User can tap on "App Preferences" button and appear on App Preferences page
4. User can verify App Preferences page with all elements
5. User can tap on Clear Clipboard field and verify Clear Clipboard popup with all elements and close it
6. User can tap on Clear Clipboard field and change timeout to 1 hour
7. User can tap on Auto Lock field and verify Auto Lock popup with all elements and close it
8. User can tap on Auto Lock field and change timeout to "Never"
9. User can tap on "Back" button and appear on Settings page

### Settings - Security - Master Password Page (12)

10. User can tap on "Master Password" button and appear on Master Password page
11. Verify that change password button is disabled by default
12. Autofill hint is displayed if user taps on current password input field
13. It is impossible to change password when there are less than 8 characters
14. It is impossible to change password when there is no uppercase
15. It is impossible to change password when there is no lowercase
16. It is impossible to change password when there is no special character
17. It is impossible to change password when there is no digit
18. It is impossible to change password when entering different passwords in each field
19. User can see warning if current password is invalid
20. User can see warning if new password is same as old password
21. User can change password with valid password

### Settings - Syncing - Blind Peering Page (12)

22. User can tap on "Blind Peering" button and appear on Blind Peering page
23. User can enable blind peering
24. User can disable blind peering
25. Verify that automatic blind peers field is chosen by default when blind peering is enabled
26. User can choose Automatic Blind Peers
27. User can choose Manual Blind Peers
28. User can add one more code field for blind peer
29. Verify that User can add only 5 code fields for blind peer
30. User can remove code fields for blind peer
31. User can see error for invalid blind peer code
32. User can add valid code for blind peer
33. Verify that user is moved to the Settings page after tapping on Back button from Blind Peering page

### Settings - Syncing - Your Devices Page (2)

34. User can tap on "Your Devices" button and appear on Your Devices page
35. Verify that user is moved to the Settings page after tapping on Back button from Your Devices page

### Settings - Vault - Your Vaults Page (14)

36. User can tap on "Your Vaults" button and appear on Your Vaults page
37. User can create new vault
38. Varify that new created vault "Kazik" is displayed on Home page when clicking on Vault tab
39. Verify that new created vault is displayed on Your Vaults page in "Current Vault" section and the old one is displayed in "Other Vaults" section
40. Verify that Create New Vault button is inactive by default on Create New Vault page
41. User can create new vault with password
42. Varify that new created vault "Ibrahim" is displayed on Home page when clicking on Vault tab
43. User can share vault
44. Verify that text "Code expires in" is changed to "Code expired" after 2 minutes
45. User can not rename vault with wrong password
46. User can rename vault with correct password
47. Varify that new created vault "IbrahimNew" is displayed on Your Vaults page
48. Varify that new created vault "IbrahimNew" is displayed on Home page when clicking on Vault tab
49. Verify that user is moved to the Settings page after tapping on Back button from Your Vaults page

### Settings - Vault - Import Items Page (19)

50. User can tap on "Import Items" button and appear on Import Items page
51. Verify OnePassword button with all elements
52. Verify Bitwarden button with all elements
53. Verify KeePass button with all elements
54. Verify KeePassXC button with all elements
55. Verify LastPass button with all elements
56. Verify NordPass button with all elements
57. Verify ProtonPass button with all elements
58. Verify Encrypted file button with all elements
59. Verify Unencrypted file button with all elements
60. It is possible to import 1Password .csv vault
61. It is possible to import Bitwarden .JSON vault
62. It is possible to import Bitwarden .CSV vault
63. It is possible to import LastPass .CSV vault
64. It is possible to import NordPass .CSV vault
65. It is possible to import Proton Pass .CSV vault
66. It is possible to import Proton Pass .JSON vault
67. It is possible to import Unencrypted file .JSON vault
68. It is possible to import Unencrypted file .CSV vault

### Settings - Vault - Export Items Page (5)

69. User can tap on "Export Items" button and appear on Export Items page
70. User can switch between "JSON (Recommended)" and "CSV" radio buttons
71. User can export vaults in JSON format without password protection
72. User can export vaults in JSON format with password protection
73. User can export vaults in CSV format

### Settings - Appearance - Language Page (4)

74. User can tap on "Language" button and appear on Language page
75. User can change language
76. User can close language popup by tapping on Cross button
77. Verify that user is moved to the Settings page after tapping on Back button from Language page

### Settings - About - Report a Problem Page (4)

78. User can tap on "Report a Problem" button and appear on Report a Problem page
79. Verify that send button is disabled by default
80. User can enter issue and tap on Send button
81. Verify that user is moved to the Settings page after tapping on Back button from Report a Problem page

### Settings - About - App Version Page (5)

82. User can tap on "App Version" button and appear on App Version page
83. User can tap on "Terms of Use" button and appear on Terms of Use page
84. User can tap on "Privacy Statement" button and appear on Privacy Statement page
85. User can tap on "Visit our website" button and appear on Visit our website page
86. Verify that user is moved to the Settings page after tapping on Back button from App Version page
