import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  BackHandler,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../theme";
import {
  SOUNDINFO,
  UPLOAD,
  UPLOADPICTURE,
  TAGS,
  ADDDESCRIPTION,
  NAME,
} from "../strings/en";
import TextView from "../components/TextView";
import fontFamilies from "../theme/fontfamilies";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { Audio } from "expo-av";
import BackButton from "../assets/backButton.svg";
import BackButtonLight from "../assets/backButtonLight.svg";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { generateRandomName, toastMessage } from "../libs/utils";
import LottieView from "lottie-react-native";
import RecordSound from "../assets/recordSound.svg";
import StopSound from "../assets/stopSound.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import { useAlbums } from "../hooks/useAlbums";
import { DEFAULT_LOCATION } from "../libs/geolocation";
import Loader from "../components/Loader";
import { err } from "react-native-svg/lib/typescript/xml";
import * as ImagePicker from "expo-image-picker";
import UploadIcon from "../assets/uploadIcon.svg"
import SmallProfilePicUpdate from "../assets/smallProfilePicUpdate.svg";
import { ScrollView } from "react-native-gesture-handler";
import ConfettiCannon from 'react-native-confetti-cannon';
function SoundDescription(): React.ReactElement {
  const route = useRoute();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { userProfile } = useUser();
  const { userLocation, saveUserAlbum } = useAlbums();
  const animationRef = React.useRef<LottieView>(null);
  const [isUploading, setUploading] = React.useState(false);
  const [image, setImage] = React.useState<any>(null);
  const [audioUrl, setAudioUrl] = React.useState<any>('');
  let confettiRef = useRef(null);
  const [sound, setSound] = React.useState<any>(null);
  const [recording, setRecording] = React.useState<string>(
    route.params?.recordedsound
  );

//@Neha get the edited parameters to use ie rate/pitch
const [audioRate,setAudioRate] =  React.useState<number>(route.params?.rate);
const [audioVolume,setAudioVolume] =  React.useState<number>(route.params?.volume);
const [shoot, setShoot] = useState(false);


  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [audioName, setAudioName] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [description, setDescription] = React.useState("");


 

  const  animationConfetti = async () => {
    //To fire the cannon again. You can make your own logic here
    setShoot(false);
    setTimeout(() => {
      setShoot(true);
      
    }, 20);
  };
  
  async function playAudio() {
    try {
      if (sound === null) {

        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: recording,
        });

        setSound(newSound);

        newSound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish == true) {
            soundwavePause();
            setIsPlaying(false);
          }
        });
        
        await newSound.setRateAsync(audioRate?audioRate:1,true)
        await newSound.setVolumeAsync(audioVolume?audioVolume:1) 
        await newSound.playAsync();
        soundwavePlay();
      } else {
        await sound.replayAsync();
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }
  async function stopAudio() {
    if (sound !== null) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      soundwavePause();
    }
  }
  useEffect(() => {
    soundwavePause();
  }, []);
  const soundwavePause = () => {
    animationRef.current?.pause();
  };
  const soundwavePlay = () => {
    animationRef.current?.play();
  };

  const onPressPlayRecord = () => {
    console.log("Selected", isPlaying);

    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onPressBackButton();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const onUploadPress = async () => {
    if (tags == "" || audioName == "" || description == "") {
      //TODO SHOW ERROR MESSAGE
      alert("Please input all fields");
    } else {
     setUploading(true)
      await uploadAudio();
     
    }
  };

  const handleUploadAudio = async (audioUrl: string,imageUrl:string) => {
    await animationConfetti()
    let albumdetails: Album = {
      albumid: generateRandomName(),
      title: audioName,
      description: description,
      url: audioUrl,
      addedDate: new Date().toDateString(),
      image: imageUrl,

      artistdetails: {
        name: userProfile ? userProfile.username : "",
        profilepicture: userProfile ? userProfile.profilepicture : "",
        tagname: tags,
        userid: userProfile ? userProfile.userid : "",
      },
      // location: userLocation ? userLocation : DEFAULT_LOCATION,
      //@Neha Temporarily updated locatoopn to Location Tübingen (Germany)
      location: DEFAULT_LOCATION,
      rate: audioRate ? audioRate : 1,
      volume: audioVolume ? audioVolume : 1,
    };

    const documentid = await saveUserAlbum?.(albumdetails);
    console.log("doicumentid is ", documentid);
    
    setUploading(false);
    await stopAudio();
    setTimeout(() => {
      toastMessage('Recording has been uploaded!')

      navigation.navigate(NavigationRoutes.Home as never);

    }, 2000);
  };

  const uploadImage = async (urlAudio:string) => {
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
      },
      (error) => {
        setUploading(false);
        console.log(error);
        
        setTimeout(() => {
        }, 1000);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          // setIsLoading(false);
          console.log("Download URL IMAGE: ", url);
          setTimeout(async () => {
            await handleUploadAudio(urlAudio,url)

          }, 1000);
          // setImage(url)
          blob.close();
          return url;
        });
      }
    );
  };

  const uploadAudio = async () => {
    const uri = recording.includes('file://')?recording:'file://'+recording;

    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          console.log("errorrrr:", e);

          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = generateRandomName();

        const ref = await firebase
          .storage()
          .ref()
          .child(`${fileName}.${fileType}`);
        const snapshot = ref.put(blob, {
          contentType: `audio/${fileType}`,
        });

        snapshot.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            setUploading(true);
          },
          (error) => {
            setUploading(false);
            console.log(error);

            return;
          },
          () => {
            snapshot.snapshot.ref.getDownloadURL().then(async (url) => {
              // setUploading(false);
              setAudioUrl(url)
              console.log("Download URL222: ", url);
              if(image)
              await uploadImage(url)
              else
              handleUploadAudio(url,'');
              // blob.close()
              return url;
            });
          }
        );
      } else {
        
        console.log("erroor with blob");
      }
    } catch (error) {
      console.log("error:", error);
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
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const renderPlayPause = () => {
    return isPlaying ? (
      <StopSound height={40} width={40} />
    ) : (
      <RecordSound height={40} width={40} />
    );
  };
  async function onPressBackButton() {
    await stopAudio();

    navigation.navigate(NavigationRoutes.RecordAudio as never);
  }
  function onPressProfilEImage() {
    navigation.navigate(NavigationRoutes.EditProfileScreen as never);
  }

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


  return (

    <View 
    style={{
      flexGrow:1,
      ...styles.container,
      backgroundColor: colors.background,
    }}
  >
    <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
    <View
      style={{
        ...styles.buttonContainer,
      }}
    >
      <TouchableOpacity onPress={onPressBackButton}>
        {isDark !== true ? (
          <BackButton height={20} width={20} />
        ) : (
          <BackButtonLight height={20} width={20} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={    async()=> onUploadPress()
        }
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.5 : 1 }}
      >
        <TextView
          text={UPLOAD}
          style={{
            ...styles.uploadButtonStyle,
          }}
        />
      </TouchableOpacity>
    </View>
    <TextView text={SOUNDINFO} style={styles.headerStyle} />
    <View
      style={{
        ...styles.cardContainer1,
        backgroundColor: colors.cardComponentColor,
      }}
    >
      <View style={{...styles.audioImgContainer}}>
      <TouchableOpacity style={styles.UploadIconStyle}
        onPress={showImageUploadOptionAlert}>
          <UploadIcon width={20} height={20} />
        </TouchableOpacity>
        {image ? (
          <Image source={{ uri: image }} style={{height: getHeight(75), width: getWidth(80),bottom:18}} />
        ) : (
          <Image
          source={require("../assets/audioImage.jpg")}
         style={{ height: getHeight(75), width: getWidth(80),bottom:18 }}
       />
        )}
      </View>
      <LottieView
        source={require("../assets/audioWave.json")}
        ref={animationRef}
        autoPlay={true}
        loop={true}
        style={{ ...styles.animationLottie }}
      />
      <TouchableOpacity
        onPress={() => {
          onPressPlayRecord();
        }}
      >
        {renderPlayPause()}
      </TouchableOpacity>
    </View>
    <View
      style={{
        ...styles.cardContainer2,
        backgroundColor: colors.cardComponentColor,
      }}
    >
      {/* <TextView
        text={UPLOADPICTURE}
        style={{
          ...styles.headingTextStyle,
          color: colors.secondarytextcolor,
        }}
      /> */}
      {/* <TouchableOpacity onPress={onPressProfilEImage}>
        <View style={{...styles.profileImgContainer}}>
          <Image
            source={{
              uri: userProfile?.profilepicture
            }}
            style={styles.profileImg} />
               <SmallProfilePicUpdate height={50} width={48} style={styles.ProfileSelectIconStyle} />
          <UploadIcon width={15} height={15}  style={styles.UploadIconStyle1}/>
        </View>
      </TouchableOpacity> */}
      <TextView text={NAME} style={styles.headingStyle} />
      <TextInput
        placeholder="Enter the name of Audio"
        placeholderTextColor={colors.addplaceholdertextcolor}
        onChangeText={setAudioName}
        value={audioName}
        style={{
          ...styles.textInputStyle,
          backgroundColor: colors.placeholderBackGroundColor,color:colors.primarytextcolor
        }}
        returnKeyType={"done"}
      />
      <TextView text={TAGS} style={styles.headingStyle} />
      <TextInput
        placeholder="Enter the Tags"
        placeholderTextColor={colors.addplaceholdertextcolor}
        onChangeText={setTags}
        value={tags}
        style={{
          ...styles.textInputStyle,
          backgroundColor: colors.placeholderBackGroundColor,color:colors.primarytextcolor
        }}
        returnKeyType={"done"}
      />
      <TextView text={ADDDESCRIPTION} style={styles.headingStyle} />
      <View
        style={{
          ...styles.textAreaContainer1,
          backgroundColor: colors.placeholderBackGroundColor
        }}
      >
        <TextInput
          placeholder={"Add a description about the sound"}
          placeholderTextColor={colors.addplaceholdertextcolor}
          multiline={true}
          numberOfLines={10}
          onChangeText={setDescription}
          value={description}
    
          style={{
            ...styles.textAreaText,
            backgroundColor: colors.placeholderBackGroundColor, color:colors.primarytextcolor
          }}
          returnKeyType={"done"}
          blurOnSubmit={true}
        />
      </View>
    </View>
    {isUploading && (
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
    {shoot ? (
          <ConfettiCannon count={150}
          origin={{x: 185, y:-10}}
          fadeOut={true}
          colors={['red',colors.tabactiveTintColor,'blue']}
          fallSpeed={1550}
          explosionSpeed={1150}/>
        ) : null}
  </View>
);
}
export default SoundDescription;
const styles = StyleSheet.create({
container: {
  padding: getHeight(20),
  flex: 1,
},
cardContainer1: {
  borderRadius: getHeight(5),
  height: getHeight(80),
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: getHeight(10),
},
buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  height: "10%",
  alignItems: "center",
  paddingTop: getHeight(30),
  
},
headerStyle: {
  fontSize: fontSize.maximum,
  fontFamily: fontFamilies.moderat,
  fontWeight: "700",
  paddingBottom: getHeight(20),
  marginTop:getHeight(10)
},
textAreaText: {
  paddingLeft: getHeight(10),
  fontFamily: fontFamilies.moderatLight,
  fontWeight: "700",
  paddingBottom: getHeight(20),
  borderRadius: getHeight(5),
  fontSize: fontSize.small,
},
animationLottie: {
  marginLeft: getHeight(10),
},
cardContainer2: {
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  marginTop: getHeight(20),
  borderRadius: getHeight(10),
  padding: getHeight(20),
},
textAreaContainer1: {
  height: getHeight(70),
  width: "100%",
  borderRadius: getHeight(5),
},
headingTextStyle: {
  fontSize: fontSize.small,
  fontFamily: fontFamilies.moderat,
  paddingBottom: getHeight(20),
},
headingStyle: {
  fontFamily: fontFamilies.moderatLight,
  fontSize: fontSize.small,
  fontWeight: "400",
  paddingBottom: getHeight(8),
},
textInputStyle: {
  fontFamily: fontFamilies.moderatLight,
  width: "100%",
  paddingBottom: getHeight(20),
  fontWeight: "700",
  borderRadius: getHeight(5),
  paddingLeft: getHeight(10),
  marginBottom: getHeight(10),
  paddingTop: getHeight(5),
},
uploadButtonStyle: {
  fontFamily: fontFamilies.moderat,
  fontSize: fontSize.small,
  right: getHeight(10),
  fontWeight: "700",
},
profileImgContainer: {
  height: getHeight(60),
  width: getHeight(60),
  borderRadius: getHeight(20),
  marginBottom: getHeight(12),
  bottom:getHeight(10)
},
profileImg: {
  height: getHeight(60),
  width: getHeight(60),
  marginBottom: getHeight(12),
  borderRadius: getHeight(50),
},
audioImgContainer: {
  height: getHeight(62),
  width: getWidth(75),
  borderRadius: 10,
  alignItems: "center",
  overflow: "hidden",
  marginBottom: getHeight(2),
  top:getHeight(3),
  zIndex:1
},
audioImg: {
  height: getHeight(60),
  width: getWidth(62),
  margin:getHeight(20),
},
UploadIconStyle: {
  alignItems: "flex-start",
  zIndex: 1,
  top: getHeight(20),
  opacity:0.6
},
UploadIconStyle1: {
  alignItems: "flex-start",
  zIndex: 1,
  opacity:0.6,
  bottom:getHeight(110),
  left:getHeight(22)
},
ProfileSelectIconStyle: {
  alignItems: "center",
  position: "relative",
  bottom:getHeight(73),
  left:1,
  opacity :0.6
},
});
//file:///data/user/0/com.soundhunters.soundhunters/cache/Audio/recording-32a61bc4-ec3d-47fb-856b-a5838196a138.m4a
