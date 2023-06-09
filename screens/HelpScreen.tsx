import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import ArrowIcon from "../assets/arrowIcon.svg";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import { useNavigation } from "@react-navigation/native";
import { getHeight } from "../libs/styleHelper";
import TextView from "../components/TextView";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useTheme } from "../theme";
import GreaterIcon from "../assets/greaterIcon.svg";
import HelpScreenData from "../components/HelpScreenData";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";

export default function HelpScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Settings as never);
  };
  const { userProfile,updateUserProfile } = useUser();
  const onPressDetail = async () => {
    navigation.navigate(NavigationRoutes.HelpDescriptionScreen as never);
  };
  const {t} =useTranslation();
  const data = [
    {
      id: "1",
      text:t("HELPSCREEN"),
   imageIcon:GreaterIcon
    },
    {
      id: "2",
      text:t("HELPSCREEN2"),
    },
    {
      id: "3",
      text:t("HELPSCREEN3"),
    },
    {
      id: "4",
      text: t("HELPSCREEN4"),
    },
  ];
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.arrowIconStyle}>
        <TouchableOpacity
          onPress={onPressBackButton}
          style={{ paddingBottom: getHeight(15) }}
        >
          {isDark !== true ? <ArrowIcon /> : <ArrowIconDark />}
        </TouchableOpacity>
        </View>
      { userProfile?.fullname ? (<TextView text={t("HEY")+userProfile?.fullname+" ,"} style={styles.heading} />)
       :
       (
       <TextView text={t("HEY")+" ,"} style={styles.heading} />
       )
}


        <TextView text={t("HEADING2")} style={styles.heading} />
        <TextView text={t("HEADING3")} style={styles.heading} />
      
      <TextView
        text={t("ISSUE")}
        style={{ ...styles.subHeading }}
        color={colors.subheadingtextcolor}
      />
      <View
        style={{
          ...styles.cardContainer,
          backgroundColor: colors.cardComponentColor,
        }}
      >
        {data.map((item: any, index: number) => {
          return (
            <HelpScreenData
              key={item.id}
              text={item.text}
              onPressHelpDesc={onPressDetail}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: getHeight(15),
    flex: 1,
  },
  arrowIconStyle: {
    // marginTop: getHeight(20),
    // paddingTop: getHeight(20),
    // paddingLeft: getHeight(20),
    height:'8%',
    justifyContent:'flex-end'
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  subHeading: {
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    fontSize: fontSize.extrasmall,
    paddingTop: getHeight(20),
    paddingBottom: getHeight(10),
  },
  cardContainer: {
    fontFamily: fontFamilies.moderatLight,
    borderRadius: getHeight(10),
  },
});
