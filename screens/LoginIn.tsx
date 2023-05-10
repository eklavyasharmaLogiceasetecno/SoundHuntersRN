import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import {
  EMAILHINT,
  LOGIN,
  NEEDLOGIN,
  NEXT,
  PASSWORDHINT,
  USERNAMEDESCRIPTION,
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
import { signIn, signUp } from "../hooks/useAuth";
import { saveUserDetails } from "../hooks/useStoredState";
import Loader from "../components/Loader";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";
export default function LoginIn(): React.ReactElement {
  const { colors,isDark } = useTheme();
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [emailaddress, setEmailAddress] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.IntroScreen as never);
  }
  const { setUserProfile, setIsOnboardingCompleted, getUserProfile } =
    useUser();

    const handlePassword = (text: string) => {
      setPassword(text);
    };
    const handleEmail = (text: string) => {
      setEmailAddress(text);
    };
    
    const onPressNextButton = async () => {
     if(emailaddress==="" && password===""){
      setPasswordError('Please Fill all the fields');
     }
      else if (!emailaddress.includes('@')) {
        setPasswordError('Invalid Email');
      }
      else if (!emailaddress.includes('.com')) {
        setPasswordError('Invalid Email');
       } else if (password.length < 6) {
        setPasswordError('Password Must be atleast 6 characters');
      } else if (emailaddress.length === 0) {
        setPasswordError('Email is required');
      }
      // else if (password.search(/[A-Z]/) < 0) {
      //   setPasswordError(' Password must have at least one uppercase letter');
      // } 
     else {
        setIsLoading(true);
        setPasswordError('');
        setIsLoading(true);
        setEmailAddress("");
      let authresponse = await signIn(emailaddress, password);
      if (authresponse.isSuccess) {
        const data = await getUserProfile?.(authresponse.uid);
       setUserProfile?.(data as UserProfile);
        saveUserDetails(data as UserProfile);
        void setIsOnboardingCompleted?.(true);
      } else {
        alert(" " + authresponse.error);
      }
    }
  
    setIsLoading(false);
      }
     
    
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
     <View style={styles.userHeadingView}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? (
            <BackButton height={20} width={20} />
          ) : (
            <BackButtonLight height={20} width={20} />
          )}
        </TouchableOpacity>

      </View>
      <Header title={LOGIN} discription={NEEDLOGIN} />
      <View style={styles.descriptionview}></View>

      <InputBox
        hint={EMAILHINT}
        style={styles.emailinput}
        handleTextChange={handleEmail}
      />

      <InputBox
        hint={PASSWORDHINT}
        style={styles.input}
        handleTextChange={handlePassword}
        secureTextEntry={true}
      />

      <View style={{ paddingLeft: getWidth(20) }}>
        <Text style={styles.errorStyle}>{passworderror}</Text>
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
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Loader />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:getHeight(40)
  },
  input: {
    height: getWidth(52),
    borderRadius: getHeight(5),
    width: getWidth(387),
    alignSelf: "center",
    marginTop: getHeight(10),
  },

  emailinput: {
    height: getWidth(52),
    borderRadius: getHeight(5),
    width: getWidth(387),
    alignSelf: "center",
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

height:"35%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  userHeadingView: {
    // height: getHeight(110),
    // marginBottom:getHeight(10)
    paddingHorizontal:getWidth(20),
    marginTop:getHeight(40),
  bottom:getHeight(10)
  },
  errorStyle: {
    color: "red",
  },
});
