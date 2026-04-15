import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DeleteFolderV2 } from 'src/screens/DeleteFolder/DeleteFolderv2'
import { ExportItems } from 'src/screens/ExportItems'
import { ImportItems } from 'src/screens/ImportItems'

import {
  AuthV2MasterPasswordScreen,
  AuthV2PinScreen
} from '../../screens/AuthV2'
import { CreateFolder } from '../../screens/CreateFolder'
import { CreateFolderV2 } from '../../screens/CreateFolder/CreateFolderV2'
import { CreateRecord } from '../../screens/CreateRecord'
import { CreatePasswordItemV2 } from '../../screens/CreateRecord/v2/CreatePasswordItemV2'
import { ErrorScreen } from '../../screens/ErrorScreen'
import { ImagePreview } from '../../screens/ImagePreview'
import { ImagePreviewV2 } from '../../screens/ImagePreview/ImagePreviewV2'
import { ImportVault } from '../../screens/ImportVault'
import { Intro } from '../../screens/Intro'
import { MultiSelectDelete } from '../../screens/MultiSelectDelete'
import { MultiSelectMove } from '../../screens/MultiSelectMove'
import { Onboarding } from '../../screens/Onboarding'
import {
  OnboardingV2Autofill,
  OnboardingV2Biometrics,
  OnboardingV2CreatePassword,
  OnboardingV2DataLocal,
  OnboardingV2Sync
} from '../../screens/OnboardingV2'
import { RecordDetails } from '../../screens/RecordDetails'
import { AboutV2 } from '../../screens/Settings/About/AboutV2'
import { AppearanceV2 } from '../../screens/Settings/Appearance/AppearanceV2'
import { Feedback } from '../../screens/Settings/Feedback'
import { MasterPassword } from '../../screens/Settings/MasterPassword'
import { MyDevices } from '../../screens/Settings/MyDevices'
import { BlindPeeringSectionV2 } from '../../screens/Settings/TabPrivacy/BlindPeeringSectionV2'
import { VaultsV2 } from '../../screens/Settings/Vaults2'
import { ShareVault } from '../../screens/ShareVault'
import { Welcome } from '../../screens/Welcome'
import { isV2 } from '../../utils/designVersion'
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
    <Stack.Screen name="Intro" component={Intro} options={noGesture} />
    <Stack.Screen
      name="Onboarding"
      component={Onboarding}
      options={noGesture}
    />
    <Stack.Screen
      name="OnboardingV2"
      component={OnboardingV2DataLocal}
      options={noGesture}
    />
    <Stack.Screen
      name="OnboardingV2Sync"
      component={OnboardingV2Sync}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingV2CreatePassword"
      component={OnboardingV2CreatePassword}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingV2Autofill"
      component={OnboardingV2Autofill}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="OnboardingV2Biometrics"
      component={OnboardingV2Biometrics}
      options={noGestureNoAnimation}
    />
    <Stack.Screen
      name="AuthV2Pin"
      component={AuthV2PinScreen}
      options={noGesture}
    />
    <Stack.Screen
      name="AuthV2MasterPassword"
      component={AuthV2MasterPasswordScreen}
      options={noGestureNoAnimation}
    />
    <Stack.Screen name="Welcome" component={Welcome} options={noGesture} />
    <Stack.Screen
      name="MainTabNavigator"
      component={TabNavigator}
      options={noGesture}
    />
    <Stack.Screen name="RecordDetails" component={RecordDetails} />
    <Stack.Screen
      name="ImagePreview"
      component={isV2() ? ImagePreviewV2 : ImagePreview}
    />
    <Stack.Screen name="CreatePasswordItem" component={CreatePasswordItemV2} />
    <Stack.Screen name="CreateRecord" component={CreateRecord} />
    <Stack.Screen
      name="CreateFolder"
      component={isV2() ? CreateFolderV2 : CreateFolder}
    />
    <Stack.Screen name="MasterPassword" component={MasterPassword} />
    <Stack.Screen name="BlindPeering" component={BlindPeeringSectionV2} />
    <Stack.Screen name="ImportVault" component={ImportVault} />
    <Stack.Screen name="ShareVault" component={ShareVault} />
    <Stack.Screen name="MultiSelectDelete" component={MultiSelectDelete} />
    <Stack.Screen name="MultiSelectMove" component={MultiSelectMove} />
    <Stack.Screen name="Feedback" component={Feedback} />
    <Stack.Screen name="AboutV2" component={AboutV2} />
    <Stack.Screen name="AppearanceV2" component={AppearanceV2} />
    <Stack.Screen name="ImportItems" component={ImportItems} />
    <Stack.Screen name="Vaults2" component={VaultsV2} />
    <Stack.Screen name="MyDevices" component={MyDevices} />
    <Stack.Screen name="ExportItems" component={ExportItems} />
    <Stack.Screen name="DeleteFolder" component={DeleteFolderV2} />
  </Stack.Navigator>
)
