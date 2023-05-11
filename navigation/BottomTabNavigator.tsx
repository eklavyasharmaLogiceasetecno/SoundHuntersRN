import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Search from "../screens/Search";
import RecordAudio from "../screens/RecordAudio";
import MusicLibrary from "../screens/MusicLibrary";
import UserProfile from "../screens/UserProfile";
import NavigationRoutes from "./constants/NavigationRoutes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeIcon from "../assets/homeIcon.svg";
import HomeIconC from "../assets/homeIconColored.svg";
import SearchIcon from "../assets/search.svg";
import SearchC from "../assets/searchColored.svg";
import RecordIcon from "../assets/recordIcon.svg";
import RecordIconC from "../assets/recordIconColored.svg";
import LibraryIcon from "../assets/libraryIcon.svg";
import LibraryIconC from "../assets/libraryIconColored.svg";
import UserIcon from "../assets/userIcon.svg";
import UserIconC from "../assets/userIconColored.svg";
import { getHeight } from "../libs/styleHelper";
import { useTheme } from "../theme";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({}): React.ReactElement => {
  const { colors } = useTheme();
  const {t} =useTranslation();
  return (
<Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor:colors.tabactiveTintColor,
        tabBarActiveBackgroundColor: colors.tabBarBackgroundColor,
        tabBarInactiveBackgroundColor: colors.tabBarBackgroundColor,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackgroundColor,
          borderTopWidth: 0,
         height:'10%',
         paddingBottom:getHeight(15),
         paddingTop:getHeight(10)
        },
        tabBarLabelStyle: {
          width: "100%",
          fontWeight:'700',
          paddingBottom:getHeight(2),
        },
      })}
    >
      <Tab.Screen
        name={NavigationRoutes.Home}
        component={Home}
        options={{
          tabBarLabel: t("HOME"),
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <HomeIconC height={28} width={28} />
            ) : (
              <HomeIcon height={28} width={28} />
            ),
        }}
      />

      <Tab.Screen
        name={NavigationRoutes.Search}
        component={Search}
        options={{
          tabBarLabel: t("SEARCH"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SearchC height={28} width={28} />
            ) : (
              <SearchIcon height={28} width={28}/>
            ),
        }}
      />

      <Tab.Screen
        name={NavigationRoutes.RecordAudio}
        component={RecordAudio}
        options={{
          tabBarLabel: t("RECORD"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <RecordIconC height={28} width={28} />
            ) : (
              <RecordIcon height={28} width={28} />
            ),
        }}
      />

      <Tab.Screen
        name={NavigationRoutes.MusicLibrary}
        component={MusicLibrary}
        options={{
          tabBarLabel: t("LIBRARY"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <LibraryIconC height={28} width={28} />
            ) : (
              <LibraryIcon height={28} width={28} />
            ),
        }}
      />

      <Tab.Screen
        name={NavigationRoutes.UserProfile}
        component={UserProfile}
        options={{
          tabBarLabel: t("PROFILE"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <UserIconC height={28} width={28} />
            ) : (
              <UserIcon height={28} width={28} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
