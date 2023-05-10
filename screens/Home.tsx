import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { useTheme } from "../theme";
import { useAlbums } from "../hooks/useAlbums";
import LocationIcon from "../assets/locationIcon.svg";
import { getWidth, getHeight } from "../libs/styleHelper";
import { Audio } from "expo-av";
import ListItem from "../components/MusicListItem";
import * as SplashScreen from "expo-splash-screen";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";
import Loader from "../components/Loader";
import { fontSize } from "../theme/fontSize";
import TextView from "../components/TextView";
import { SOUNDHUNTERS } from "../strings/en";
import LocationIconDark from "../assets/locationIconDark.svg";
import { useFocusEffect } from "@react-navigation/native";

export default function Home(): React.ReactElement {
  void SplashScreen.hideAsync();
  const [albumList, setAlbumList] = useState<Album[] | undefined>([]);
  const { getAlbumList, saveAlbum } = useAlbums();
  const { userProfile } = useUser();
  const [sound, setSound] = useState(new Audio.Sound());
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { colors, isDark } = useTheme();
  const [selecteAudioIndex, setSelectedAudioIndex] = useState<number>();
  useEffect(() => {
    setIsLoading(true);
    // fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // return () => {
      fetchData();
      // };
    }, [])
  );

  async function fetchData() {
    const data = await getAlbumList?.();


    setAlbumList(data);
    setIsLoading(false);
  }

  const handleListItemClick = (item: any) => {
    setIsLoading(false);
    stopSound();
    setSelectedAudioIndex(-1);
    navigation.navigate(NavigationRoutes.MusicPlayer, { musicitem: item });
  };

  const handleMapNavigation = () => {
    setIsLoading(false);
    navigation.navigate(NavigationRoutes.LocationMap, {
      isFromHomeScreen: true,
    });
  };

  const playSound = async (album : Album) => {
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

  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): React.ReactElement => (
    //NEHA: TO CHECK WITH Malkeet
    <ListItem
      isProfile={true}
      item={item}
      selectedItemIndex={selecteAudioIndex}
      index={index}
      onPressPlayIcon={() => {
        setSelectedAudioIndex((prev) => (prev == index ? -1 : index));
        // if (item.isPlaying) {
        //   item.isPlaying = false;
        // } else {
        //   item.isPlaying = true;
        // }
        if (selecteAudioIndex == index) {
          stopSound();
        } else playSound(item);
        
      }}
      onPressListItem={() => handleListItemClick(item)}
      isPlaying={item.isPlaying}
    />
  );

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />

      <View
        style={{
          ...styles.headerBar,
          borderBottomColor: colors.cardbackground,
        }}
      >
        <TextView text={SOUNDHUNTERS} style={styles.headerTitle} />

        <TouchableOpacity
          style={{ padding: getHeight(5) }}
          onPress={() => handleMapNavigation()}
        >
          {isDark !== true ? <LocationIcon /> : <LocationIconDark />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={albumList}
        renderItem={renderItem}
        keyExtractor={(item, index) => "key" + index}
        keyboardShouldPersistTaps="always"
      />
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
    paddingTop: getHeight(20),
  },
  headerBar: {
    borderBottomWidth: getWidth(1),
    height: "10%",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-end",
    padding: getWidth(10),
  },
  headerTitle: {
    fontSize: fontSize.subheading,
  },
  button: {
    height: getHeight(40),
    marginTop: getHeight(10),
    position: "relative",
    right: 20,
    justifyContent: "center",
    textAlign: "center",
  },
});
