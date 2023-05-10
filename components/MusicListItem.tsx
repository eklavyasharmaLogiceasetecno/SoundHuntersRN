import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../theme";
import { getWidth, getHeight } from "../libs/styleHelper";
import fontFamilies from "../theme/fontfamilies";
import TextView from "../components/TextView";
import PlaySongIcon from "../assets/playSongIcon.svg";
import { fontSize } from "../theme/fontSize";
import PlaySongIconDark from "../assets/playSongIconDark.svg";
import { useUser } from "../hooks/useUser";
import StopSound from "../assets/pauseAudioblack.svg";
import StopSoundWhite from "../assets/pauseAudiWhite.svg";

import moment from "moment";

interface ListItemProps {
  item?: any;
  isProfile?: boolean;
  onPressPlayIcon?: () => void;
  onPressListItem?: () => void;
  isPlaying?: boolean;
  selectedItemIndex?: number;
  index: number;
}

const ListItem = (props: ListItemProps): React.ReactElement => {
  const {
    item,
    onPressPlayIcon,
    onPressListItem,
    selectedItemIndex,
    isProfile,
    isPlaying,
    index,
  } = props;
  const { colors, isDark } = useTheme();
  const { userProfile } = useUser();

  return (
    <TouchableOpacity onPress={onPressListItem}>
      <View style={styles.listcontainer}>
        {isProfile && (
          <View style={styles.profileImageView}>
            <Image
              source={item.artistdetails.profilepicture && item.artistdetails.profilepicture!=="test"?{
                uri: item.artistdetails.profilepicture,
              }: require('../assets/imagePlaceholder.png')}
              style={styles.profileImageStyle}
            />
            <View>
              <TextView
                text={item.artistdetails.name}
                style={styles.titletextView}
              />
              <TextView
                text={item.artistdetails.tagname}
                style={styles.subtitleView}
              />
            </View>
          </View>
        )}
        <View
          style={{
            ...styles.cardcontainer,
            backgroundColor: colors.cardbackground,
          }}
        >
          {item.image?<Image source={{ uri: item.image }} style={styles.imageStyle} />
          :<Image source={ require('../assets/audioImage.jpg')}  style={styles.imageStyle} />}
          <View style={{ marginLeft: getWidth(20) }}>
            <TextView
              text={moment(item.addedDate).format("dddd, Do MMM")}
              style={styles.MondayStyle}
            />
            <TextView text={item.title} style={styles.musictitletextview} />
            <TextView
              text={item.description}
              style={styles.descriptiontextView}
              color={colors.secondarytextcolor}
            />

            <TouchableOpacity
              // onPress={() => playSound(item.url)}
              onPress={onPressPlayIcon}
            >
              {isDark !== true ? (
                index === selectedItemIndex ? (
                  <StopSound style={styles.playSongIconStyle} />
                ) : selectedItemIndex === -1 ? (
                  <PlaySongIcon style={styles.playSongIconStyle} />
                ) : (
                  <PlaySongIcon style={styles.playSongIconStyle} />
                )
              ) : index === selectedItemIndex ? (
                <StopSoundWhite style={styles.playSongIconStyle} />
              ) : selectedItemIndex === -1 ? (
                <PlaySongIconDark style={styles.playSongIconStyle} />
              ) : (
                <PlaySongIconDark style={styles.playSongIconStyle} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  listcontainer: {
    margin: getWidth(15),
  },
  titletextView: {
    fontSize: fontSize.font16,
    paddingLeft: getWidth(10),
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  subtitleView: {
    fontSize: fontSize.extrasmall,
    fontFamily: fontFamilies.roboto,
    paddingLeft: getHeight(10),
  },
  musictitletextview: {
    fontSize: fontSize.small,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  descriptiontextView: {
    fontSize: fontSize.smallest,
    fontFamily: fontFamilies.roboto,
    width: getWidth(250),
    marginTop: getHeight(3),
  },
  cardcontainer: {
    padding: getHeight(20),
    borderRadius: getWidth(10),
    flexDirection: "row",
    marginTop: getHeight(10),
  },
  imageStyle: {
    width: getWidth(100),
    height: getHeight(100),
    borderRadius: getWidth(15),
  },
  profileImageView: {
    flexDirection: "row",
    alignItems: "center",
  },
  playSongIconStyle: {
    marginTop: getHeight(10),
  },
  MondayStyle: {
    fontSize: fontSize.extrasmall,
    fontFamily: fontFamilies.roboto,
    fontWeight: "500",
    marginBottom: getHeight(5),
  },
  profileImageStyle: {
    width: getHeight(50),
    height: getHeight(50),
    resizeMode: "contain",
    borderRadius: getHeight(25),
    borderWidth: 2,
    borderColor: "#67DCCB",
  },
});
