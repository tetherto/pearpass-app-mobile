import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DeleteFolder } from 'src/screens/DeleteFolder'
import { ExportCodes } from 'src/screens/ExportCodes'
import { ExportItems } from 'src/screens/ExportItems'
import { ImportCodes } from 'src/screens/ImportCodes'
import { ImportItems } from 'src/screens/ImportItems'

import { AuthMasterPasswordScreen, AuthPinScreen } from '../../screens/Auth'
import { CreateFolder } from '../../screens/CreateFolder'
import { CreateRecord } from '../../screens/CreateRecord'
import { CreatePasswordItem } from '../../screens/CreateRecord/CreatePasswordItem'
import { ErrorScreen } from '../../screens/ErrorScreen'
import { ImagePreview } from '../../screens/ImagePreview'
import { ImportVault } from '../../screens/ImportVault'
import { MultiSelectDelete } from '../../screens/MultiSelectDelete'
import { MultiSelectMove } from '../../screens/MultiSelectMove'
import {
  OnboardingAutofill,
  OnboardingBiometrics,
  OnboardingCreatePassword,
  OnboardingDataLocal,
  OnboardingSync
} from '../../screens/Onboarding'
import { RecordDetails } from '../../screens/RecordDetails'
import { About } from '../../screens/Settings/About'
import { Appearance } from '../../screens/Settings/Appearance'
import { AppPreferences } from '../../screens/Settings/AppPreferences'
import { Diagnostics } from '../../screens/Settings/Diagnostics'
import { Feedback } from '../../screens/Settings/Feedback'
import { MasterPassword } from '../../screens/Settings/MasterPassword'
import { PairedDevicesScreen } from '../../screens/Settings/PairedDevicesScreen'
import { BlindPeeringSection } from '../../screens/Settings/TabPrivacy/BlindPeeringSection'
import { VaultDeleteScreen } from '../../screens/Settings/VaultDeleteScreen'
import { VaultPasswordScreen } from '../../screens/Settings/VaultPasswordScreen'
import { VaultRenameScreen } from '../../screens/Settings/VaultRenameScreen'
import { Vaults } from '../../screens/Settings/Vaults'
import { VaultShareScreen } from '../../screens/Settings/VaultShareScreen'
import { ShareVault } from '../../screens/ShareVault'
import { Welcome } from '../../screens/Welcome'
import { TabNavigator } from '../TabNavigator'

const Stack = createNativeStackNavigator()

const noGesture = { gestureEnabled: false }
const noGestureNoAnimation = { gestureEnabled: false, animation: 'none' }

/**
 * Navigation component for the app.
 * @param {{ initialRouteName: string | null }} props - The initial route name.
 * @returns {JSX.Element} The navigation stack.
 */
export const Navigation = ({ initialRouteName }) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={() => ({
      headerShown: false
    })}
  >
    <Stack.Screen name="Error" component={ErrorScreen} options={noGesture} />
    <Stack.Screen
      name="Onboarding"
      component={OnboardingDataLocal}
      options={noGesture}
    />
    <Stack.Screen
      name="OnboardingSync"
      component={OnboardingSync}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingCreatePassword"
      component={OnboardingCreatePassword}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingAutofill"
      component={OnboardingAutofill}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingBiometrics"
      component={OnboardingBiometrics}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="AuthPin"
      component={AuthPinScreen}
      options={noGesture}
    />
    <Stack.Screen
      name="AuthMasterPassword"
      component={AuthMasterPasswordScreen}
      options={noGestureNoAnimation}
    />
    <Stack.Screen name="Welcome" component={Welcome} options={noGesture} />
    <Stack.Screen
      name="MainTabNavigator"
      component={TabNavigator}
      options={noGesture}
    />
    <Stack.Screen name="RecordDetails" component={RecordDetails} />
    <Stack.Screen name="ImagePreview" component={ImagePreview} />
    <Stack.Screen name="CreatePasswordItem" component={CreatePasswordItem} />
    <Stack.Screen name="CreateRecord" component={CreateRecord} />
    <Stack.Screen name="CreateFolder" component={CreateFolder} />
    <Stack.Screen name="AppPreferences" component={AppPreferences} />
    <Stack.Screen name="MasterPassword" component={MasterPassword} />
    <Stack.Screen name="BlindPeering" component={BlindPeeringSection} />
    <Stack.Screen name="ImportVault" component={ImportVault} />
    <Stack.Screen name="ShareVault" component={ShareVault} />
    <Stack.Screen name="MultiSelectDelete" component={MultiSelectDelete} />
    <Stack.Screen name="MultiSelectMove" component={MultiSelectMove} />
    <Stack.Screen name="Feedback" component={Feedback} />
    <Stack.Screen name="Diagnostics" component={Diagnostics} />
    <Stack.Screen name="About" component={About} />
    <Stack.Screen name="Appearance" component={Appearance} />
    <Stack.Screen name="ImportItems" component={ImportItems} />
    <Stack.Screen name="ImportCodes" component={ImportCodes} />
    <Stack.Screen name="Vaults" component={Vaults} />
    <Stack.Screen name="ExportItems" component={ExportItems} />
    <Stack.Screen name="ExportCodes" component={ExportCodes} />
    <Stack.Screen name="DeleteFolder" component={DeleteFolder} />
    <Stack.Screen name="VaultRenameScreen" component={VaultRenameScreen} />
    <Stack.Screen name="VaultPasswordScreen" component={VaultPasswordScreen} />
    <Stack.Screen name="VaultDeleteScreen" component={VaultDeleteScreen} />
    <Stack.Screen name="PairedDevicesScreen" component={PairedDevicesScreen} />
    <Stack.Screen name="VaultShareScreen" component={VaultShareScreen} />
  </Stack.Navigator>
)
