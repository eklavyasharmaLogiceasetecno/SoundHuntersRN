import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native";

import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import SettingIcon from "../assets/settingIcon.svg";
import { useTheme } from "../theme";
import TextView from "../components/TextView";
import { AUDIOPOST, EDITPROFILE, NOAUDIOPOST } from "../strings/en";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import Button from "../components/Button";
import { getHeight, getWidth } from "../libs/styleHelper";
import ListItem from "../components/MusicListItem";
import { useAlbums } from "../hooks/useAlbums";
import { useUser } from "../hooks/useUser";
import Loader from "../components/Loader";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

export default function UserProfile(): React.ReactElement {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [albumList, setAlbumList] = useState<Album[] | undefined>([]);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(new Audio.Sound());
  const { getUserAlbumList } = useAlbums();
  const { userProfile } = useUser();
  const PROFILE_PIC_KEY = "profile_pic_cache_key";
  const imageUrl = userProfile?.profilepicture;
  const [selecteAudioIndex, setSelectedAudioIndex] = useState<number>();
  const onPressSettingButton = async () => {
    setIsLoading(false);
    navigation.navigate(NavigationRoutes.Settings as never);
  };
  const onPressEditButton = async () => {
    setIsLoading(false);
    navigation.navigate(NavigationRoutes.EditProfileScreen as never);
  };
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        fetchData();
      };
    }, [])
  );

  async function fetchData() {
    const data = await getUserAlbumList?.(
      userProfile ? userProfile.userid : "-1"
    );
    setAlbumList(data);
    setIsLoading(false);
  }
  //@Dev STop Audio
  const stopSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const playSound = async (album: Album) => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    //TODO: Need to check better way to handle this
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.log(e);
      }
    }

    await sound.loadAsync({ uri: album.url });
    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish == true) {
        setSelectedAudioIndex(-1);
      }
    });
    try {
      await sound.setRateAsync(album.rate?album.rate:1,true)
      await sound.setVolumeAsync(album.volume?album.volume:1) 
      await sound.playAsync();
    } catch (e) {
      console.log(e);
    }
  };
  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): React.ReactElement => (
    <ListItem
      item={item}
      // onPressPlayIcon={() => playSound(item.url)}
      index={index}
      selectedItemIndex={selecteAudioIndex}
      onPressPlayIcon={() => {
        setSelectedAudioIndex((prev) => (prev == index ? -1 : index));

        if (selecteAudioIndex == index) {
          stopSound();
        } else playSound(item);
      }}
    />
  );
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />

      <View style={styles.mainView}>
        <View style={styles.headerStyle}>
          <Image
            source={(userProfile?.profilepicture && userProfile?.profilepicture!=='test')?{
              uri: userProfile?.profilepicture,
            }:require("../assets/imagePlaceholder.png")}
            style={styles.profileImageStyle}
          />

          <TouchableOpacity onPress={onPressSettingButton}>
            <SettingIcon width={30} height={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.headingView}>
          <View>
            {userProfile?.fullname ? (
              <TextView
                text={
                  userProfile?.fullname ? userProfile?.fullname : "ADD NAME"
                }
                style={styles.heading}
              />
            ) : (
              <TextView
                text={"ADD NAME"}
                style={{ ...styles.heading1 }}
                color={colors.searchplaceholdercolor}
              />
            )}
            <TextView text={"@" + userProfile?.username} />
          </View>

          <Button
            title={EDITPROFILE}
            fontSize={15}
            backgroundColor={colors.inputBoxBackground}
            style={styles.editButtonStyle}
            onPress={onPressEditButton}
            TextColor={colors.editProfilebuttonTextColor}
          />
        </View>

        {/* <View>
          {userProfile?.biodata && (
            <TextView text={userProfile?.biodata} style={styles.description} />
          )}
          <TextView text={AUDIOPOST} style={styles.audioPostStyle} />
        </View> */}
      </View>
      {/* <View style={{ flex: 1 }}>
        {isLoading && <Loader />}

        {albumList && albumList.length > 0 ? (
          <FlatList
            data={albumList}
            renderItem={renderItem}
            keyExtractor={(item, index) => "key" + index}
            keyboardShouldPersistTaps="always"
          />
        ) : (
          <View>
            {!isLoading && (
              <TextView text={NOAUDIOPOST} style={styles.description} />
            )}
          </View>
        )}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainerStyle: {
    flex: 0.6,
    justifyContent: "center",
  },
  mainView: {
    padding: getWidth(15),
    marginTop: getHeight(20),
  },
  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: getHeight(20),
    paddingBottom: getHeight(10),
  },
  heading: {
    fontSize: fontSize.heading,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  heading1: {
    fontSize: fontSize.heading,
    fontFamily: fontFamilies.moderat,
  },
  editButtonStyle: {
    width: getWidth(100),
    height: getHeight(40),
    padding: 0,
    marginLeft: getWidth(10),
    justifyContent: "center",
  },
  headingView: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: getHeight(20),
  },
  audioPostStyle: {
    fontSize: fontSize.medium,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingTop: getHeight(10),
  },
  profileImageStyle: {
    width: getHeight(84),
    height: getHeight(84),
    resizeMode: "contain",
    borderRadius: getHeight(42),
    borderWidth: 2,
    borderColor: "#67DCCB",
  },
  descriptionView: {
    alignItems: "center",
  },
  description: {
    fontFamily: fontFamilies.nunito,
    fontWeight: "400",
    width: "100%",
    textAlign: "center",
    fontSize: 15,
  },
});
