import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import TextView from "../components/TextView";
import ArrowIcon from "../assets/arrowIcon.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import { useTheme } from "../theme";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import {
  BIO,
  BIODESCRIPTION,
  CHANGEPROFILE,
  DONE,
  EDITPROFILE,
  NAME,
  PROFILENAME,
  USERHEADING,
  USERNAME,
} from "../strings/en";
import fontFamilies from "../theme/fontfamilies";
import { fontSize } from "../theme/fontSize";
import * as ImagePicker from "expo-image-picker";
import UploadIcon from "../assets/uploadIcon.svg";
import ProfileSelectIcon from "../assets/profileSelectIcon.svg";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import { useUser } from "../hooks/useUser";
import Loader from "../components/Loader";
import { generateRandomName } from "../libs/utils";
import firebase from "firebase/compat";

const EditProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [isUploading, setUploading] = React.useState(false);

  const { userProfile, updateUserProfile, setUserProfile } = useUser();
  const [fullName, setFullName] = React.useState(
    userProfile ? userProfile.fullname : ""
  );
  const [biodata, setBioData] = React.useState(
    userProfile ? userProfile.biodata : ""
  );
  const [image, setImage] = useState<any>(
    userProfile ? userProfile.profilepicture : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.UserProfile as never);
  };

  const uploadImage = async () => {
    setIsLoading(true);
if(image==="test"){
  updateData('test')
  
}
else{
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
          // saveDetails("test");
        }, 1000);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          // setIsLoading(false);
          console.log("Download URL: ", url);
         updateData(url)
          setImage(url)
          blob.close();
          return url;
        });
      }
    );
}
  };


  const updateData = async (url:string) => {
    
    
    userProfile &&
      (await updateUserProfile?.(userProfile.userid, fullName, biodata, url));
    setIsLoading(false);
    navigation.navigate(NavigationRoutes.Home as never);
    
  };
  const showImageUploadOptionAlert = () => {
    Alert.alert(
      //This is title
      "Choose Option",
      //This is body text
      "Upload Profile Picture Via :",
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
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />

      <View style={styles.arrowIconStyle}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? <ArrowIcon /> : <ArrowIconDark />}
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadImage}>
          <TextView
            text={DONE}
            style={{ ...styles.buttonStyle, color: colors.commontextcolor }}
          />
        </TouchableOpacity>
      </View>
      <TextView text={EDITPROFILE} style={styles.heading} />
      <View style={styles.profileImageView}>
        <View
          style={{
            ...styles.profileImgContainer,
            backgroundColor: colors.inputBoxBackground,
          }}
        >
         
            <Image source={image?{
              uri: image,
            }:require("../assets/imagePlaceholder.png")} style={styles.profileImg} />
          
          <ProfileSelectIcon style={styles.ProfileSelectIconStyle} />
          <TouchableOpacity
            onPress={showImageUploadOptionAlert}
            style={styles.UploadIconStyle}
          >
            <UploadIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
        <TextView text={CHANGEPROFILE} style={styles.profileTextStyle} />
      </View>
      <View
        style={{
          ...styles.cardView,
          backgroundColor: colors.cardComponentColor,
        }}
      >
        <TextView
          text={NAME}
          style={{ ...styles.headingStyle, color: colors.primarytextcolor }}
        />
        {/* <TextView
          text={userProfile?.fullname}
          style={{ ...styles.headingTextStyle, color: colors.text }}
        /> */}

        <TextInput
          placeholder={NAME}
          style={{ ...styles.placeholderStyle, color: colors.primarytextcolor }}
          placeholderTextColor={"#B4B4B4"}
          multiline={true}
          numberOfLines={10}
          value={fullName}
          returnKeyType={"done"}
          blurOnSubmit={true}
          onChangeText={setFullName}
        />

        <TextView
          text={USERNAME}
          style={{ ...styles.headingStyle, color: colors.primarytextcolor }}
        />
        <TextView
          text={userProfile?.username}
          style={{ ...styles.headingTextStyle, color: colors.text }}
        />
        {/* <TextView
          text={BIO}
          style={{ ...styles.headingStyle, color: colors.primarytextcolor }}
        />
        <View
          style={{
            ...styles.textAreaContainer,
            backgroundColor: colors.background,
          }}
        >
          <TextInput
            placeholder={BIODESCRIPTION}
            style={{
              ...styles.placeholderStyle,
              color: colors.primarytextcolor,
            }}
            placeholderTextColor={"#B4B4B4"}
            multiline={true}
            numberOfLines={10}
            value={biodata}
            returnKeyType={"done"}
            blurOnSubmit={true}
            onChangeText={setBioData}
          />
        </View> */}
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
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getWidth(20),
  },
  cardView: {
    paddingHorizontal: getWidth(20),
    paddingBottom: getHeight(20),
  },
  arrowIconStyle: {
    height: "8%",
    justifyContent: "space-between",
    paddingBottom: getHeight(10),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonStyle: {
    fontWeight: "700",
    fontFamily: fontFamilies.moderat,
    fontSize: fontSize.medium,
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingBottom: getHeight(20),
  },
  profileImgContainer: {
    height: getHeight(190),
    width: getHeight(190),
    borderRadius: getHeight(95),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: getHeight(20),
  },
  profileImageView: {
    alignItems: "center",
    justifyContent: "center",
    height: "30%",
  },
  cardContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  profileImg: {
    height: getHeight(250),
    width: getWidth(250),
  },
  profileTextStyle: {
    fontFamily: fontFamilies.moderat,
    fontSize: fontSize.small,
    fontWeight: "700",
  },
  ProfileSelectIconStyle: {
    alignItems: "center",
    zIndex: 2,
    top: getHeight(100),
    opacity: 0.7,
    position: "absolute",
  },
  UploadIconStyle: {
    alignItems: "center",
    zIndex: 3,
    top: getHeight(115),
    position: "absolute",
  },

  textAreaContainer: {
    height: getHeight(60),
    borderRadius: getWidth(5),
    paddingHorizontal: getWidth(10),
    marginTop: getHeight(10),
    width: "100%",
  },
  headingTextStyle: {
    fontSize: fontSize.small,
    fontFamily: fontFamilies.moderat,
    paddingBottom: getHeight(20),
    fontWeight: "700",
  },
  headingStyle: {
    fontFamily: fontFamilies.moderatLight,
    fontSize: fontSize.small,
    marginTop: getHeight(20),
    fontWeight: "400",
  },
  placeholderStyle: {
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    fontSize: fontSize.small,
    height: getHeight(50),
  },
});
