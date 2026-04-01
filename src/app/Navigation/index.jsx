import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CreateFolder } from '../../screens/CreateFolder'
import { CreateRecord } from '../../screens/CreateRecord'
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
import { MasterPassword } from '../../screens/Settings/MasterPassword'
import { BlindPeeringSectionV2 } from '../../screens/Settings/TabPrivacy/BlindPeeringSectionV2'
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
    <Stack.Screen name="CreateRecord" component={CreateRecord} />
    <Stack.Screen name="CreateFolder" component={CreateFolder} />
    <Stack.Screen name="MasterPassword" component={MasterPassword} />
    <Stack.Screen name="BlindPeering" component={BlindPeeringSectionV2} />
    <Stack.Screen name="ImportVault" component={ImportVault} />
    <Stack.Screen name="ShareVault" component={ShareVault} />
    <Stack.Screen name="MultiSelectDelete" component={MultiSelectDelete} />
    <Stack.Screen name="MultiSelectMove" component={MultiSelectMove} />
  </Stack.Navigator>
)
