import * as React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../theme";
import NavigationRoutes from "./constants/NavigationRoutes";

import CreateUserName from "../screens/CreateUserName";
import CreatePassword from "../screens/CreatePassword";
import SelectLanguage from "../screens/SelectLanguage";
import UploadProfilePicture from "../screens/UploadProfilePicture";
import IntroScreen from "../screens/IntroScreen";
import LoginIn from "../screens/LoginIn";

const Stack = createStackNavigator();

const OnboardingStackNavigator = (): React.ReactElement => (
  <Stack.Navigator
  screenOptions={{
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 500,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 500,
        },
      },
    },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }}
>
    <Stack.Screen name={NavigationRoutes.IntroScreen} component={IntroScreen} options={{gestureEnabled:false}}/>

  <Stack.Screen
      name={NavigationRoutes.LOGIN}
      component={LoginIn}
    />

    <Stack.Screen
      name={NavigationRoutes.CreateUserName}
      component={CreateUserName}
    />
    <Stack.Screen
      name={NavigationRoutes.CreatePassword}
      component={CreatePassword}
    />
    <Stack.Screen
      name={NavigationRoutes.SelectLanguage}
      component={SelectLanguage}
    />

    <Stack.Screen
      name={NavigationRoutes.UploadProfilePicture}
      component={UploadProfilePicture}
    />
  </Stack.Navigator>
);

export default OnboardingStackNavigator;
