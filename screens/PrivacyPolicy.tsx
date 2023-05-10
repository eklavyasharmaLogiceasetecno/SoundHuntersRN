import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import TextView from "../components/TextView";
import { ABOUT, PRIVACYPOLICY } from "../strings/en";
import ArrowIcon from "../assets/arrowIcon.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import { useTheme } from "../theme";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import { useNavigation } from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useTranslation } from "react-i18next";



function PrivacyPolicyScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation()
      const data=[
        {
          id:'1',
          text:t("PRIVACY")
        },
        {
          id:'2',
          text:t("PRIVACYID2")
        },
        {
          id:'3',
          text:t("PRIVACYID3")
        },
        {
          id:'4',
          text:t("PRIVACYID4")
        },
        {
          id:'5',
          text:t("PRIVACYID5")
        },
        {
          id:'6',
          text:t("PRIVACYID6")
        },
        {
          id:'7',
          text:t("PRIVACYID7")
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
        <TextView text={t("PRIVACYPOLICY")} style={styles.heading} />
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

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getWidth(20),
  },
  arrowIconStyle: {
    // height:Platform.OS==="ios"?"10%":"12%",
    marginTop:Platform.OS==="ios"?0:getHeight(25),
    justifyContent:'flex-end',
    padding:getHeight(10),
    paddingHorizontal:getWidth(10),
    paddingTop:Platform.OS==="ios"?0:getHeight(20)
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingBottom: getHeight(10),
    paddingTop:getHeight(10)
  },
  discription: {
    fontFamily: fontFamilies.moderatLight,
    padding: getHeight(20),
    fontWeight: "400",
    fontSize: fontSize.extrasmall,
  },
});
