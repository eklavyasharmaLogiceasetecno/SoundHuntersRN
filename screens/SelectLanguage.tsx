import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import TextView from "../components/TextView";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import {
  CHOOSELANGUAGE,
  ENGLISH,
  GERMAN,
  NEXT,
  SELECTLANGUAGE,
} from "../strings/en";
import Button from "../components/Button";
import { useTheme } from "../theme";
import { fontSize } from "../theme/fontSize";
import { getHeight, getWidth } from "../libs/styleHelper";
import { useUser } from "../hooks/useUser";
import fontFamilies from "../theme/fontfamilies";
import Header from "../components/Header";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";
import { useTranslation } from "react-i18next";
export default function SelectLanguage(): React.ReactElement {
  const { setIsOnboardingCompleted } = useUser();
  const { colors, isDark } = useTheme();
  const {i18n,t}=useTranslation();

  const navigation = useNavigation();
  const [isSelectedPrimary, setIsSelectedPrimary] = useState(false);
  const [isSelectedSecondary, setIsSelectedSecondary] = useState(false);
  const { userProfile, setUserProfile } = useUser();
  const [language,setLanguage]=useState<any>(
    i18n.language ==="german" ?"German":"English"
  )

  const onSelectPrimaryLanguage = () => {
    setLanguage("English")
    setIsSelectedSecondary(false);
    setIsSelectedPrimary(true);
  };
  const onSelectSecondaryLanguage = () => {
    setLanguage("German")
    setIsSelectedPrimary(false);
    setIsSelectedSecondary(true);
  };
console.log("language",language,i18n.language)
  const onPressNextButton = async () => {
    if(language==="German")
    
      i18n.changeLanguage("german")
      else i18n.changeLanguage('en')
    
    setUserProfile?.({
      ...(userProfile as UserProfile),
      primarylanguage: isSelectedPrimary ? "English" : "German",
    });

    //TODO VALIDATION PENDING.
    navigation.navigate(NavigationRoutes.CreatePassword as never);

    //TEMP NAVIGATE TO Home Root
    // void setIsOnboardingCompleted?.(true);
  };
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.CreateUserName as never);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <View style={{ height: getHeight(20), bottom: getHeight(20) }}>
        <View style={{ height: getHeight(60) }}>
          <TouchableOpacity
            style={styles.backButtonStyle}
            onPress={onPressBackButton}
          >
            {isDark !== true ? (
              <BackButton height={20} width={20} />
            ) : (
              <BackButtonLight height={20} width={20} />
            )}
          </TouchableOpacity>
          <TextView
            text={"Create Account"}
            style={styles.upperViewText}
            color={colors.primarytextcolor}
          />
        </View>
        <View style={styles.dashedLineView}>
          <View
            style={{
              ...styles.dashedLineStyle,
              backgroundColor: colors.onBoardingViewColor,
            }}
          />
          <View
            style={{
              ...styles.dashedLineStyle,
              backgroundColor: "#67DCCB",
            }}
          />
          <View
            style={{
              ...styles.dashedLineStyle,
              backgroundColor: colors.onBoardingViewColor,
            }}
          />
          <View
            style={{
              ...styles.dashedLineStyle,
              backgroundColor: colors.onBoardingViewColor,
            }}
          />
        </View>
      </View>
      <View style={styles.languageHeadingView}></View>
      <Header title={SELECTLANGUAGE} discription={CHOOSELANGUAGE} />

      <View style={styles.languageContent}></View>
      <View>
        <TouchableOpacity onPress={onSelectPrimaryLanguage}>
          <View
            style={{
              ...styles.languageview,
              backgroundColor: isSelectedPrimary
                ? colors.buttonBackground
                : colors.inputBoxBackground,
            }}
          >
            <TextView text={ENGLISH} style={styles.languageTextStyle} />
            <Image
              source={require("../assets/flaguk.png")}
              style={styles.flagUkImageStyle}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSelectSecondaryLanguage}>
          <View
            style={{
              ...styles.languageview,
              backgroundColor: isSelectedSecondary
                ? colors.buttonBackground
                : colors.inputBoxBackground,
            }}
          >
            <TextView text={GERMAN} style={styles.languageTextStyle} />
            <Image
              source={require("../assets/flaggermany.png")}
              style={styles.flagImageStyle}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <Button
          title={NEXT}
          style={styles.button}
          onPress={onPressNextButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  languageview: {
    width: getWidth(360),
    height: getHeight(50),
    margin: getHeight(10),
    justifyContent: "space-between",
    borderRadius: getHeight(10),
    paddingLeft: getWidth(10),
    flexDirection: "row",
    alignItems: "center",
    fontFamily: fontFamilies.roboto,
  },
  button: {
    width: getWidth(285),
    height: getHeight(55),
    justifyContent: "center",
    alignItems: "center",
  },
  chooseLanguage: {
    fontFamily: fontFamilies.roboto,
  },
  languageContent: {
    height: getHeight(80),
    alignItems: "center",
  },
  flagUkImageStyle: {
    width: getWidth(28),
    height: getHeight(28),
    borderRadius: getHeight(50),
    marginRight: getWidth(10),
  },
  flagImageStyle: {
    width: getWidth(40),
    height: getHeight(40),
  },
  buttonView: {
    flex: 0.7,
    justifyContent: "flex-end",
  },
  languageHeadingView: {
    height: getHeight(120),
  },
  languageTextStyle: {
    fontSize: fontSize.extrasmall,
    fontFamily: fontFamilies.moderatLight,
    fontWeight: "400",
  },
  upperViewText: {
    alignSelf: "center",
    fontSize: fontSize.small,
    bottom: getHeight(15),
    fontWeight: "700",
    fontFamily: fontFamilies.moderat,
  },
  backButtonStyle: {
    alignItems: "flex-start",
    top: getHeight(10),
    marginLeft: getHeight(15),
  },
  dashedLineView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  dashedLineStyle: {
    width: Platform.OS === "ios" ? getWidth(100) : getWidth(100),
    height: getHeight(2),
  },
});
