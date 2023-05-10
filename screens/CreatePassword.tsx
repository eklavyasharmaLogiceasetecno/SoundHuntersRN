import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "../theme";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import TextView from "../components/TextView";
import {
  NEXT,
  PASSWORDDESCRIPTION,
  PASSWORDHEADING,
  PASSWORDSUBHEADING,
} from "../strings/en";
import fontFamilies from "../theme/fontfamilies";
import { fontSize } from "../theme/fontSize";
import { getHeight, getWidth } from "../libs/styleHelper";
import Header from "../components/Header";
import { useUser } from "../hooks/useUser";
import { signUp } from "../hooks/useAuth";
import Loader from "../components/Loader";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";

export default function CreatePassword(): React.ReactElement {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { userProfile, setUserProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isInput, setIsInput] = useState(true);

  const handlePasswordInputChange = (text: string) => {
  
    setPassword(text);
    setIsInput(false);
  };

  const onPressNextButton = async () => {
    if (password.length < 8) {
      setPasswordError("Password Must be atleast 8 characters");
    } else if (password.indexOf(" ") >= 0) {
      setPasswordError(" Password cannot contain Spaces");
    } else {
      setPasswordError("");
      setIsLoading(true);

      //signup user
      let authresponse = await signUp(
        userProfile ? userProfile?.email : "",
        password
      );

      if (authresponse.isSuccess) {
        setUserProfile?.({
          ...(userProfile as UserProfile),
          profilepicture: "test",
          userid: authresponse.uid,
        });

        setIsLoading(false);
        navigation.navigate(NavigationRoutes.UploadProfilePicture as never);
      } else {
        setIsLoading(false);
        //handle Error for SignUp
        alert(" " + authresponse.error);
      }
    }
  };
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.SelectLanguage as never);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      {isLoading && <Loader />}
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
        </View>
      </View>
      <View style={styles.passwordHeadingView}></View>
      <Header title={PASSWORDHEADING} discription={PASSWORDSUBHEADING} />
      <View style={styles.descriptionview}></View>
      <View>
        <InputBox
          style={styles.input}
          handleTextChange={handlePasswordInputChange}
          secureTextEntry={true}
          returnType={"done"}
        />
        <Text style={styles.errorStyle}>{passwordError}</Text>
        <TextView text={PASSWORDDESCRIPTION} style={styles.descriptionstyle} />
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
    alignItems: "center",
  },
  input: {
    height: getHeight(52),
    width: getWidth(387),
    borderRadius: getHeight(10),
  },

  descriptionstyle: {
    textAlign: "center",
    padding: getHeight(10),
    width: getWidth(380),
    height: getHeight(100),
    lineHeight: getHeight(20),
    fontFamily: fontFamilies.moderatLight,
    fontWeight: "400",
    fontSize: fontSize.extrasmall,
  },
  button: {
    width: getWidth(285),
    height: getHeight(55),
    justifyContent: "center",
    alignItems: "center",
  },
  passwordHeadingView: {
    height: getHeight(110),
  },
  descriptionview: {
    height: getHeight(80),
  },
  buttonView: {
    flex: 0.7,
    justifyContent: "flex-end",
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
