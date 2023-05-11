import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import TextView from "../components/TextView";
import { ABOUT } from "../strings/en";
import ArrowIcon from "../assets/arrowIcon.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import { useTheme } from "../theme";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useTranslation } from "react-i18next";


function AboutScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const {t}=useTranslation()
  const data=[
    {
      id:'1',
      text:t("ABOUTSCREEN")
    },
    {
      id:'2',
      text:t("ABOUTSCREENID2")
    },
    {
      id:'3',
      text:t("ABOUTSCREENID3")
    },
    {
      id:'4',
      text:t("ABOUTSCREENID4")
    },
    {
      id:'5',
      text:t("ABOUTSCREENID5")
    },
  ]
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Settings as never);
  };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <View style={styles.arrowIconStyle}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? <ArrowIcon /> : <ArrowIconDark />}
        </TouchableOpacity>
        <TextView text={t("ABOUT")} style={styles.heading} />
      </View>
      <View style={{ backgroundColor: colors.cardComponentColor }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item: any) => {
            return (
              <TextView
                style={{
                  ...styles.discription,
                  color: colors.primarytextcolor,
                }}
                text={item.text}
                key={item.id}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getWidth(20),
  },
  arrowIconStyle: {
    height: "14%",
    justifyContent: "flex-end",
    padding: getHeight(10),
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingTop: getHeight(10),
  },
  discription: {
    fontFamily: fontFamilies.moderatLight,
    padding: getHeight(20),
    fontWeight: "400",
    fontSize: fontSize.extrasmall,
  },
});
