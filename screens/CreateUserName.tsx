import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useTheme } from "../theme";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import {
  CHOOSEAUSERNAME,
  EMAILHINT,
  NEEDAUSERNAME,
  NEXT,
  USERNAMEDESCRIPTION,
  USERNAMEHINT,
} from "../strings/en";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useUser } from "../hooks/useUser";
import TextView from "../components/TextView";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import HeadingProps from "../components/Header";
import Header from "../components/Header";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";

export default function CreateUserName(): React.ReactElement {
  void SplashScreen.hideAsync();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [username, setUserName] = useState("");
  const [emailaddress, setEmailAddress] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const { userProfile, setUserProfile, setIsOnboardingCompleted } = useUser();

  const handleUserName = (text: string) => {
    console.log("text is ", text);
    setUserName(text);
  };

  const handleEmail = (text: string) => {
    console.log("text is ", text);
    setEmailAddress(text);
  };

  const onPressNextButton = async () => {
    if (username.length < 8 || emailaddress.length < 8) {
      setUserNameError("Username|Email Must be atleast 8 characters");
    } else if (username.indexOf(" ") >= 0) {
      setUserNameError("Username cannot contain Spaces");
    } else {
      setUserNameError("");
      setUserProfile?.({
        ...(userProfile as UserProfile),
        username: username,
        email: emailaddress,
      });
      console.log('USER DETAIL..',JSON.stringify(userProfile))
      navigation.navigate(NavigationRoutes.SelectLanguage as never);
    }

    /*************** SAVE USER DATA ****************/
    // const user={
    //   email:"test@test.com",
    //   username:"test",
    //   profilepicture:"test picture",
    //   primarylanguage:"EN"

    // }
    // await saveUserProfile?.(user);

    /*************** SAVE USER DATA ENDS ****************/

    /*************** GET USER DATA ****************/

    // const data = await getUserProfile?.("test111");
    // /*************** GET USER DATA ENDS ****************/

    // console.log("************", data);
    // navigation.navigate(NavigationRoutes.SelectLanguage as never);

    //  void setIsOnboardingCompleted?.(true);
  };
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.IntroScreen as never);
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
            style={{ ...styles.dashedLineStyle, backgroundColor: "#67DCCB" }}
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
          <View
            style={{
              ...styles.dashedLineStyle,
              backgroundColor: colors.onBoardingViewColor,
            }}
          />
        </View>
      </View>
      <View style={styles.userHeadingView}></View>
      <Header title={CHOOSEAUSERNAME} discription={NEEDAUSERNAME} />
      <View style={styles.descriptionview}></View>

      <InputBox
        hint={USERNAMEHINT}
        style={styles.input}
        handleTextChange={handleUserName}
        returnType={"done"}
      />

      <InputBox
        hint={EMAILHINT}
        style={styles.emailinput}
        handleTextChange={handleEmail}
        returnType={"done"}
      />

      <View style={{ paddingLeft: 20 }}>
        <Text style={styles.errorStyle}>{userNameError}</Text>
      </View>
      <View>
        <TextView text={USERNAMEDESCRIPTION} style={styles.descriptionstyle} />
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
    justifyContent: "center",
  },
  input: {
    height: getWidth(52),
    borderRadius: getHeight(5),
    width: getWidth(387),
    alignSelf: "center",
  },

  emailinput: {
    height: getWidth(52),
    borderRadius: getHeight(5),
    width: getWidth(387),
    alignSelf: "center",
    marginTop: 10,
  },

  button: {
    width: getWidth(285),
    height: getHeight(55),
    justifyContent: "center",
    alignItems: "center",
  },

  descriptionstyle: {
    textAlign: "center",
    padding: getHeight(20),
    lineHeight: getHeight(20),
    fontFamily: fontFamilies.roboto,
  },
  descriptionview: {
    height: getHeight(80),
  },
  buttonView: {
    flex: 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  userHeadingView: {
    height: getHeight(110),
  },
  errorStyle: {
    color: "red",
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
