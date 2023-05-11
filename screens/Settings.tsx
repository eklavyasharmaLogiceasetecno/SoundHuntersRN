import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import TextView from "../components/TextView";
import { useTheme } from "../theme";
import fontFamilies from "../theme/fontfamilies";
import { fontSize } from "../theme/fontSize";
import ArrowIcon from "../assets/arrowIcon.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import PolicyIcon from "../assets/policyIcon.svg";
import HelpIcon from "../assets/helpIcon.svg";
import LogoutIcon from "../assets/logoutIcon.svg";
import ModeIcon from "../assets/modeIcon.svg";
import SettingData from "../components/SettingsData";
import AboutIcon from "../assets/aboutIcon.svg";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useUser } from "../hooks/useUser";
import { removeDetails, saveUserDetails } from "../hooks/useStoredState";

import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";
import { useTranslation } from "react-i18next";


function Settings() {
  const [toggle, setToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { colors, setScheme, isDark } = useTheme();

  const navigation = useNavigation();

  const { isOnboardingCompleted, setIsOnboardingCompleted } = useUser();
  const {t}=useTranslation()
  const data = [
    {
      id: "1",
      name:t("ABOUT"),
      imageIcon: AboutIcon,
      isSwitch: false,
    },
    {
      id: "2",
      name: t("PRIVACYPOLICY"),
      imageIcon: PolicyIcon,
      isSwitch: false,
    },
    {
      id: "3",
      name: t("HELP"),
      imageIcon: HelpIcon,
      isSwitch: false,
    },
    {
      id: "4",
      name:t( "LOGOUT"),
      imageIcon: LogoutIcon,
      isSwitch: false,
    },
  ];

  useFocusEffect(() => {
    async function fetchDarkModeState() {
      try {
        const darkModeState = await AsyncStorage.getItem("darkModeState");
        if (darkModeState !== null) {
          setDarkMode(JSON.parse(darkModeState));
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
  const toggleSwitch = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("darkModeState", JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  const onPressSettingButton = async (index: number) => {
    switch (index) {
      case 0:
        navigation.navigate(NavigationRoutes.AboutScreen as never);
        break;

      case 1:
        navigation.navigate(NavigationRoutes.PrivacyPolicy as never);
        break;

      case 2:
        navigation.navigate(NavigationRoutes.HelpScreen as never);
        break;

      case 3:
        void setIsOnboardingCompleted?.(false);
        // saveUserDetails({} as UserProfile);

        removeDetails();
        break;
    }
  };
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Home as never);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />

      <View style={styles.arrowIconStyle}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? (
            <BackButton height={20} width={20} />
          ) : (
            <BackButtonLight height={20} width={20} />
          )}
        </TouchableOpacity>
        </View>
        <TextView text={t("SETTINGS")} style={styles.heading} />
     

      <View
        style={{
          ...styles.cardContainer,
          backgroundColor: colors.cardComponentColor,
        }}
      >
        {data.map((item: any, index: number) => {
          return (
            <SettingData
              key={item.id}
              text={item.name}
              image={item.imageIcon}
              isSwitch={item.isSwitch}
              onPress={() => onPressSettingButton(index)}
            />
          );
        })}
        <View style={styles.modesContainer}>
          <View style={styles.modesStyle}>
            <ModeIcon />
            <TextView text={t("MODES")} style={styles.modesTextView} />
          </View>
          <Switch
            trackColor={{ false: "gray", true: "teal" }}
            thumbColor={colors.secondaryBackground}
            ios_backgroundColor="gray"
            value={isDark}
            onValueChange={(value) => {
              toggleSwitch(value);
              console.log("value is ", value);
              setDarkMode(value);
              if (value) {
                setScheme("dark");
              } else {
                setScheme("");
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    paddingVertical:getHeight(30),
    padding:getWidth(15)
  },
  cardContainer: {
    fontFamily: fontFamilies.moderat,
    color: "red",
    paddingVertical:getHeight(10)
  },
  heading: {
    fontSize: fontSize.headingFont,
    fontFamily: fontFamilies.moderat,
    fontWeight:'700',
    paddingBottom:getHeight(10),
  },
  arrowIconStyle: {
    height: "8%",
    justifyContent: "flex-end",
    paddingBottom: getHeight(10),
  },
  cardView: {
    flexDirection: "row",
  },
  modesStyle: {
    flexDirection: "row",
    paddingLeft: getWidth(10),
  },
  modesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:getHeight(10),
    paddingBottom:getHeight(5)

  },
  modesTextView: {
    paddingLeft: getWidth(10),
    fontFamily: fontFamilies.moderat,
  },
});
