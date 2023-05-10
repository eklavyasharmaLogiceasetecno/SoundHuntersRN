import * as React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import NavigationRoutes from "./constants/NavigationRoutes";
import BottomTabNavigator from "./BottomTabNavigator";
import Settings from "../screens/Settings";
import LocationMap from "../screens/LocationMap";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import MusicPlayer from "../screens/MusicPlayer";
import SoundDescription from "../screens/SoundDescription";
import EditSound from "../screens/EditSound";
import EditProfileScreen from "../screens/EditProfileScreen";
import HelpScreen from "../screens/HelpScreen";
import AboutScreen from "../screens/AboutScreen";
import HelpDescriptionScreen from "../screens/HelpDescriptionScreen";

const Stack = createStackNavigator();

const CoreFeaturesStackNavigator = ({
  navigation,
  route,
}): React.ReactElement => (
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
    <Stack.Screen
      name={NavigationRoutes.BottomTabNavigator}
      component={BottomTabNavigator}
    />
    <Stack.Screen name={NavigationRoutes.Settings} component={Settings} />
    <Stack.Screen name={NavigationRoutes.LocationMap} component={LocationMap} />
    <Stack.Screen
      name={NavigationRoutes.PrivacyPolicy}
      component={PrivacyPolicy}
    />
    <Stack.Screen
      name={NavigationRoutes.MusicPlayer}
      component={MusicPlayer}
      initialParams={route?.params}
    />

    <Stack.Screen
      name={NavigationRoutes.SoundDescription}
      component={SoundDescription}
      initialParams={route?.params}
    />

    <Stack.Screen name={NavigationRoutes.EditSound} component={EditSound} />
    <Stack.Screen
      name={NavigationRoutes.EditProfileScreen}
      component={EditProfileScreen}
    />
    <Stack.Screen name={NavigationRoutes.AboutScreen} component={AboutScreen} />

    <Stack.Screen name={NavigationRoutes.HelpScreen} component={HelpScreen} />
    <Stack.Screen
      name={NavigationRoutes.HelpDescriptionScreen}
      component={HelpDescriptionScreen}
      initialParams={route?.params}
    />
  </Stack.Navigator>
);

export default CoreFeaturesStackNavigator;
