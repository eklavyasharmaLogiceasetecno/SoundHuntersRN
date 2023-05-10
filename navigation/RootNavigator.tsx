
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { useUser } from '../hooks/useUser'
import CoreFeaturesStackNavigator from './CoreFeaturesStackNavigator'
import OnboardingStackNavigator from './OnboardingStackNavigator'

const RootNavigator = (): React.ReactElement => {
  const { getStoredDetails,isOnboardingCompleted } = useUser()

  if (isOnboardingCompleted === undefined) void SplashScreen.preventAutoHideAsync()

 React.useEffect(() => {
    async function loadDataAsync() {
    const isOnboardCompleted= await getStoredDetails?.();
    }

    loadDataAsync();
  }, []);


  return (

    <NavigationContainer>
      {(isOnboardingCompleted === false) &&
        (
          <OnboardingStackNavigator />
        )}{
        isOnboardingCompleted === true && (
        <CoreFeaturesStackNavigator />

         //TEMP
         // <OnboardingStackNavigator />
        )
      }
    </NavigationContainer>
  )
}

export default RootNavigator