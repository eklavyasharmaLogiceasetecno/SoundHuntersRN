import React, { useState } from "react";
import { View, StyleSheet, Switch } from "react-native";
import TextView from "./TextView";
import GreaterIcon from "../assets/greaterIcon.svg";
import GreaterIconDark from "../assets/greaterIconDark.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import fontFamilies from "../theme/fontfamilies";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "../theme";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";

interface HelpScreenDataProps {
  text?: string;
  onPressHelpDesc?: () => void;
}

const HelpScreenData = (props: HelpScreenDataProps): React.ReactElement => {
  const { text, onPressHelpDesc, ...otherProps } = props;
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Settings as never);
  };
  return (
    <TouchableOpacity onPress={onPressHelpDesc}>
      <View style={styles.cardView}>
        <View style={{ flexDirection: "row" }}>
          <TextView text={text} style={styles.text} />
        </View>
        {isDark !== true ? <GreaterIcon /> : <GreaterIconDark />}
      </View>
    </TouchableOpacity>
  );
};

export default HelpScreenData;
const styles = StyleSheet.create({
  cardView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: getHeight(15),
    alignItems: "center",
  },
  iconsView: {
    paddingRight: getWidth(10),
  },
  text: {
    fontFamily: fontFamilies.moderatLight,
    fontWeight: "400",
  },
});
