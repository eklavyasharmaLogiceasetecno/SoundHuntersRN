import React, { useState } from "react";
import { StyleSheet, View, FlatList, StatusBar } from "react-native";
import { useTheme } from "../theme";
import fontFamilies from "../theme/fontfamilies";
import { useAlbums } from "../hooks/useAlbums";
import LocationIcon from "../assets/locationIcon.svg";
import { getWidth, getHeight } from "../libs/styleHelper";
import ListItem from "../components/MusicListItem";
import SearchBar from "../components/SearchBar";
import { NOSEARCHRESULT, RESULT, SEARCH, SOUNDHUNTERS } from "../strings/en";
import { fontSize } from "../theme/fontSize";
import TextView from "../components/TextView";
import LocationIconDark from "../assets/locationIconDark.svg";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../components/Loader";
import { Audio } from "expo-av";

export default function Search(): React.ReactElement {
  const { colors, isDark } = useTheme();
  const [searchResults, setSearchResults] = useState<Album[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { getFilteredAlbumList } = useAlbums();
  const [selecteAudioIndex, setSelectedAudioIndex] = useState<number>();
  const [sound, setSound] = useState(new Audio.Sound());

  const navigation = useNavigation();
  const onPressSearch = async () => {
    //TODO need to disable button instead of check applied here for search text length
    if (searchText.length > 3) {
      setIsLoading(true);
      const data = await getFilteredAlbumList?.(searchText);
      setSearchResults(data);
      setIsLoading(false);
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
  const handleMapNavigation = () => {
    navigation.navigate(NavigationRoutes.LocationMap, {
      searchedAlbumList: searchResults[0],
    });
  };
  const handleSearchInput = (text: string) => {
    setSearchText(text);
    //@Dev clear searched result with clear search input
    if (text == "") setSearchResults([]);
  };

  const handleListItemClick = async (item: any) => {
    setIsLoading(false);
    setSelectedAudioIndex(-1);
    await stopSound();
    navigation.navigate(NavigationRoutes.MusicPlayer, { musicitem: item });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): React.ReactElement => (
    <ListItem
      isProfile={true}
      item={item}
      onPressListItem={() => handleListItemClick(item)}
      selectedItemIndex={selecteAudioIndex}
      index={index}
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

      <View
        style={{
          ...styles.headerBar,
          borderBottomColor: colors.cardbackground,
        }}
      >
        <TextView text={SOUNDHUNTERS} style={styles.headerTitle} />
        <View style={{ paddingHorizontal: getHeight(5) }}>
          {isDark !== true ? (
            <LocationIcon onPress={() => handleMapNavigation()} />
          ) : (
            <LocationIconDark onPress={() => handleMapNavigation()} />
          )}
        </View>
      </View>

      <SearchBar
        hint={SEARCH}
        onPressSearch={onPressSearch}
        handleTextChange={handleSearchInput}
        onSubmit={onPressSearch}
        returnType="search"
      />
      {!isLoading && searchResults && searchResults.length > 0 ? (
        <TextView text={RESULT} style={{ ...styles.searchResult }} />
      ) : null}
      <FlatList
        data={searchResults}
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
  searchResult: {
    marginLeft: getHeight(15),
    marginTop: getHeight(10),
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
});
