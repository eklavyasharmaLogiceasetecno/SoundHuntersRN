import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "../theme";
import Button from "../components/Button";
import { DONE, PROFILEPICTURE, PROFILERANDOMTEXT, SELECT } from "../strings/en";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import TextView from "../components/TextView";
import * as ImagePicker from "expo-image-picker";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import ProfilePictureIcon from "../assets/profilePictureIcon.svg";
import { useUser } from "../hooks/useUser";
import { saveUserDetails } from "../hooks/useStoredState";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { generateRandomName } from "../libs/utils";
import Loader from "../components/Loader";
import fontFamilies from "../theme/fontfamilies";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";

export default function UploadProfilePicture(): React.ReactElement {
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const {
    saveUserProfile,
    userProfile,
    setUserProfile,
    setIsOnboardingCompleted,
  } = useUser();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const ref = await firebase
      .storage()
      .ref()
      .child(`Pictures/` + generateRandomName());
    const snapshot = ref.put(blob);
    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true);
        setIsLoading(true);
      },
      (error) => {
        setUploading(false);
        setIsLoading(false);
        console.log(error);
        setUserProfile?.({
          ...(userProfile as UserProfile),
          profilepicture: "",
        });
        setTimeout(() => {
          saveDetails("test");
        }, 1000);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          // setIsLoading(false);
          console.log("Download URL: ", url);
          setUserProfile?.({
            ...(userProfile as UserProfile),
            profilepicture: url,
          });
          setTimeout(() => {
            saveDetails(url);
          }, 1000);
          // setImage(url)
          blob.close();
          return url;
        });
      }
    );
  };
  const showImageUploadOptionAlert = () => {
    Alert.alert(
      //This is title
      "Choose Option",
      //This is body text
      "Upload Profile Picture From :",
      [
        {
          text: "Gallery",
          onPress: () => {
            pickImage();
          },
        },
        {
          text: "Camera",
          onPress: () => {
            openCamera();
          },
        },
        { text: "Cancel", onPress: () => {} },
      ],
      { cancelable: true }
    );
    // <AwesomeAlert
    //   show={true}
    //   showProgress={false}
    //   title="AwesomeAlert"
    //   message="I have a message for you!"
    //   closeOnTouchOutside={true}
    //   closeOnHardwareBackPress={false}
    //   showCancelButton={true}
    //   showConfirmButton={true}
    //   cancelText="No, cancel"
    //   confirmText="Yes, delete it"
    //   confirmButtonColor="#DD6B55"
    //   onCancelPressed={() => {
    //     // this.hideAlert();
    //   }}
    //   onConfirmPressed={() => {
    //     // this.hideAlert();
    //   }}
    // />;
  };

  const saveDetails = async (url) => {
    const documentid = await saveUserProfile?.({
      ...(userProfile as UserProfile),
      profilepicture: url,
    });
    if (documentid != null) {
      setUserProfile?.({
        ...(userProfile as UserProfile),
        documentid: documentid,
        profilepicture: url,
      });
      saveUserDetails({
        ...(userProfile as UserProfile),
        documentid: documentid,
        profilepicture: url,
      });
    }
    console.error(JSON.stringify(userProfile))
    void setIsOnboardingCompleted?.(true);
    setIsLoading(false);
  };
  const onPressNextButton = async () => {
    if (image != null) {
      uploadImage();
    } else {
      setTimeout(async () => {
        await saveDetails("test");
      }, 1000);
      void setIsOnboardingCompleted?.(true);
    }
  };
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.CreatePassword as never);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      {isLoading && <Loader />}
      <View
        style={{
          height: getHeight(20),
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <View style={{ height: getHeight(60), width: "100%" }}>
          <TouchableOpacity
            style={styles.backButtonStyle}
            onPress={onPressBackButton}
          >
            {isDark !== true ? (
              <BackButton width={20} />
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
              backgroundColor: colors.onBoardingViewColor,
            }}
          />
          <View
            style={{ ...styles.dashedLineStyle, backgroundColor: "#67DCCB" }}
          />
        </View>
      </View>
      <View style={{ ...styles.headingView }}>
        <TextView text={SELECT} style={styles.heading} />
        <TextView text={PROFILEPICTURE} style={styles.heading} />
      </View>
      <View
        style={{
          ...styles.profileImgContainer,
          backgroundColor: colors.inputBoxBackground,
        }}
      >
        <TouchableOpacity onPress={showImageUploadOptionAlert}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImg} />
          ) : (
            <ProfilePictureIcon />
          )}
        </TouchableOpacity>
      </View>
      <TextView text={PROFILERANDOMTEXT} style={styles.text} />
      <View
        style={{
          height: "25%",
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "blue",
        }}
      >
        <Button
          title={DONE}
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
  text: {
    paddingTop: getHeight(10),
    textAlign: "center",
    lineHeight: getHeight(20),
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: fontFamilies.moderatLight,
    fontWeight: "700",
    fontSize: fontSize.extrasmall,
  },
  heading: {
    textAlign: "center",
    fontSize: fontSize.maximum,
    fontWeight: "bold",
  },
  button: {
    width: "70%",
    padding: getHeight(15),
    position: "absolute",
    bottom: getHeight(40),
  },
  headingView: {
    marginBottom: getHeight(20),
    justifyContent: "flex-end",
    height: "20%",
  },
  profileImgContainer: {
    height: "27%",
    width: "55%",
    borderRadius: getWidth(125),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: getHeight(10),
  },
  profileImg: {
    height: getHeight(250),
    width: getWidth(250),
  },
  iconStyle: {
    height: getHeight(50),
    width: getWidth(46),
  },
  upperViewText: {
    alignSelf: "center",
    fontSize: fontSize.small,
    bottom: getHeight(15),
    fontWeight: "700",
    fontFamily: fontFamilies.moderat,
  },
  backButtonStyle: {
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
