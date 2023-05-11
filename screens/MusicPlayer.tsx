import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  Image,
  Share,
  StatusBar,
  ScrollView,
  BackHandler,
} from "react-native";

import { useTheme } from "../theme";
import { getHeight, getWidth } from "../libs/styleHelper";
import { TouchableOpacity } from "react-native-gesture-handler";
import TextView from "../components/TextView";

import fontFamilies from "../theme/fontfamilies";
import { fontSize } from "../theme/fontSize";

import MoreOptionIcon from "../assets/moreOptionIcon.svg";
import SaveIcon from "../assets/saveIcon.svg";
import SaveIconGreen from "../assets/savedIcon.svg";
import ShareIcon from "../assets/shareIcon.svg";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";
import { toastMessage } from "../libs/utils";
import { useAlbums } from "../hooks/useAlbums";
import { Audio } from "expo-av";
import StopSound from "../assets/stopSound.svg";
import RecordSound from "../assets/recordSound.svg";
import BackButton from "../assets/backButton.svg";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

function MusicPlayer(item: any): React.ReactElement {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { userProfile } = useUser();
  const { saveAlbum, checkIfAlbumIsSaved } = useAlbums();
  const route = useRoute();
  const [albumDetails, setAlbumDetails] = useState<Album>(
    route.params?.musicitem
  );

  const [sound, setSound] = useState<any>(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAlreadySavedAlbum, setIsAlreadySavedAlbum] = useState(false);
  const [refreshAlbum, setRefreshAlbum] = useState(false)
  const {t}=useTranslation()

 
  useFocusEffect(
    React.useCallback(() => {
      return async () => {
        if( await checkIfAlbumIsSaved(albumDetails.albumid))
    
    setIsAlreadySavedAlbum(true)
    else setIsAlreadySavedAlbum(false)
    // setRefreshAlbum(!refreshAlbum)
      };
    }, [])
  );
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

  const playSound = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    // TODO: Need to check better way to handle this
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.log(e);
      }
    }

    await sound.loadAsync({ uri: albumDetails.url });

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish == true) {
        setIsPlaying(false);
      }
    });
    console.error(JSON.stringify(albumDetails))
    try {
      await sound.setRateAsync(albumDetails.rate?albumDetails.rate:1,true) 
      await sound.setVolumeAsync(albumDetails.volume?albumDetails.volume:1) 
      await sound.playAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const pauseSound = async () => {
    const status = await sound.getStatusAsync();
    console.log("statusOfAudio.", status.isPlaying);
    if (status.isPlaying) {
      console.log("pausing...");
      await sound.pauseAsync();
      console.log("paused!");
      setIsPlaying(false);
    } else {
      console.log("Resuming...");
      await sound.playAsync();
      console.log("Resumed!");
      setIsPlaying(true);
    }
  };
  async function stopAudio() {
    if (sound !== null) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  const onHandleShareMusic = async () => {
    try {
      const url = albumDetails.url;
      await Share.share({
        title: "Share image",
        message: `Check out this Music!  ${albumDetails.title}
            \n ${url}`,
        url: url,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onHandleSaveAudio = async () => {
    if(isAlreadySavedAlbum)
    {
      toastMessage(t("MUSICPLAYERTOAST1"));
      
    }
    else{
    let savealbumid = await saveAlbum?.(
      userProfile ? userProfile.userid : "",
      albumDetails.albumid
    );
    if (savealbumid) {
      toastMessage(t("MUSICPLAYERTOAST2"));
    }
  }
  };
  const onPressPlayRecord = () => {
    console.log("Selected", isPlaying);

    if (isPlaying) {
      pauseSound();
    } else {
      playSound();
    }

    setIsPlaying(!isPlaying);
  };
  const renderPlayPause = () => {
    return isPlaying ? (
      <StopSound height={40} width={40} />
    ) : (
      <RecordSound height={40} width={40} />
    );
  };
  async function onPressBackButton() {
    try {
      setIsPlaying(false);

      await stopAudio();
      navigation.navigate(NavigationRoutes.Home as never);
    } catch (error) {
      navigation.navigate(NavigationRoutes.Home as never);
    }
  }

  

  return (
    <ImageBackground
      source={albumDetails.image?
        { uri: albumDetails.image }
      :  require('../assets/audioImage.jpg')}
      style={{ flex: 1 }}
      blurRadius={5}
    >
      <TouchableOpacity
        style={{
          paddingVertical: getHeight(30),
          paddingLeft: getWidth(20),
          zIndex: 4,
          top: getHeight(25),
        }}
        onPress={onPressBackButton}
      >
        <BackButton height={20} width={20} />
      </TouchableOpacity>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <View style={styles.mainView}>
        <View style={styles.headerView}>
          <View style={styles.ProfileImageView}>
            <Image
              source={albumDetails.artistdetails.profilepicture
                && albumDetails.artistdetails.profilepicture!=="test"?{ uri: albumDetails.artistdetails.profilepicture }
              :require('../assets/imagePlaceholder.png')
            }
              style={{
                height: getHeight(44),
                width: getHeight(44),
                borderRadius: getWidth(20),
              }}
            />
            <View style={styles.userNameView}>
              <TextView
                text={albumDetails.artistdetails.name}
                color={colors.commontextcolor}
                style={styles.nameStyle}
              />
            </View>
          </View>
          {/* <MoreOptionIcon color={colors.secondaryBackground} /> */}
        </View>
        <View style={styles.soundImageStyle}>
          <Image
            source={albumDetails.image?{ uri: albumDetails.image }: require('../assets/audioImage.jpg')}
            style={{ width: getWidth(400), height: getHeight(500) }}
          />
          <View style={styles.playIconView}>
            <TouchableOpacity
              onPress={() => {
                onPressPlayRecord();
              }}
            >
              {renderPlayPause()}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headingView}>
          <TextView text={albumDetails.title} color={colors.commontextcolor} />
          <ScrollView style={{ height: getHeight(100) }}>
            <TextView
              text={albumDetails.description}
              color={colors.commontextcolor}
              style={styles.descriptionTextStyle}
            />
          </ScrollView>
        </View>
        <View style={styles.footerIconStyle}>
          <TouchableOpacity onPress={onHandleSaveAudio}>
           { isAlreadySavedAlbum ?<SaveIconGreen/>:<SaveIcon/>}
          </TouchableOpacity>
          <TouchableOpacity onPress={onHandleShareMusic}>
            <ShareIcon color={colors.iconcolor} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    
  );
}

export default MusicPlayer;

const styles = StyleSheet.create({
  mainView: {
    justifyContent: "center",
    flex: 1,
    paddingTop: Platform.OS === "ios" ? getHeight(0) : getHeight(15),
  },
  backgroundStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  headingStyle: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  headingView: {
    alignItems: "center",
    marginTop: getHeight(15),
    paddingHorizontal: getWidth(10),
  },
  soundImageStyle: {
    alignSelf: "center",
    justifyContent: "center",
  },
  userNameView: {
    flexDirection: "column",
    justifyContent: "center",
  },
  nameStyle: {
    marginLeft: getWidth(10),
    fontFamily: fontFamilies.moderat,
    fontSize: fontSize.small,
  },
  subNameStyle: {
    marginLeft: getWidth(10),
  },
  headerView: {
    flexDirection: "row",
    marginHorizontal: getHeight(22),
    marginBottom: getHeight(15),
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerIconStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "15%",
    alignItems: "center",
  },
  playIconView: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
  },
  ProfileImageView: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionTextStyle: {
    paddingHorizontal: getWidth(10),
  },
});
