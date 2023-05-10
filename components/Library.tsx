import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import fontFamilies from "../theme/fontfamilies";
import TextView from "./TextView";
import { useTheme } from "../theme";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";

interface LibraryProps {
  item?: any;
  onPressPlayIcon?: () => void;
}
export default function MusicLibrary(props: LibraryProps): React.ReactElement {
  const { item } = props;
  const { colors } = useTheme();
  const navigation = useNavigation();

  const onPressMusic = (album: Album) => {
    navigation.navigate(NavigationRoutes.MusicPlayer, { musicitem: album });
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.cardcontainer,
        backgroundColor: colors.cardbackground,
      }}
      onPress={() => {
        onPressMusic(item);
      }}
    >
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      {item.image?<Image source={{ uri: item.image }} style={styles.imageStyle} />
          :<Image source={ require('../assets/audioImage.jpg')} style={{...styles.imageStyle,width:getWidth(181)}}  />}
      <TextView text={item.title} style={styles.musictitletextview} />
      <TextView
        text={item.description}
        numberOfLines={3}
        style={styles.descriptiontextView}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titletextView: {
    fontSize: fontSize.heading,
    marginTop: getHeight(10),
    fontFamily: fontFamilies.moderat,
  },
  subtitleView: {
    fontSize: fontSize.extrasmall,
    fontFamily: fontFamilies.roboto,
  },
  musictitletextview: {
    fontSize: fontSize.small,
    fontFamily: fontFamilies.moderat,
    paddingHorizontal: getWidth(10),
    paddingVertical: getHeight(4),
  },
  descriptiontextView: {
    fontFamily: fontFamilies.roboto,
    paddingHorizontal: getWidth(10),
    paddingBottom: getHeight(10),
  },
  cardcontainer: {
    flexDirection: "column",
    marginTop: getHeight(10),
    margin: getHeight(10),
    width: "45%",
    borderRadius: getWidth(10),
  },
  textStyle: {
    fontSize: 24,
  },
  imageStyle: {
    height: getHeight(120),
    borderRadius: getWidth(10),
  },
});
