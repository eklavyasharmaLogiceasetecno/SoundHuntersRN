import React, { useState } from "react";
import { View, StyleSheet, Switch } from "react-native";
import TextView from "./TextView";
import GreaterIcon from "../assets/greaterIcon.svg";
import GreaterIconDarkMode from "../assets/greaterIconDarkMode.svg";

import { getHeight, getWidth } from "../libs/styleHelper";
import fontFamilies from "../theme/fontfamilies";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "../theme";
import { fontSize } from "../theme/fontSize";

interface SettingDataProps {
  text?: string;
  image: any;
  isSwitch?: boolean;
  onPress?:()=>void;
}

const SettingData = (props: SettingDataProps): React.ReactElement => {
  const { text, image, isSwitch,onPress, ...otherProps } = props;
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.cardView}>
      
      <View  style={{ flexDirection:"row"}}>
      
        {<View style={styles.iconsView}>
          {React.createElement(image)}
          </View>}
        <TextView text={text} style={styles.text}/>
      </View>


      {isDark
      ?<GreaterIconDarkMode />:<GreaterIcon />      }
        

    </View>
    </TouchableOpacity>
  );
};

export default SettingData;
const styles = StyleSheet.create({
  cardView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:getHeight(15),
  },
  iconsView:{
    paddingRight:getWidth(10)
  },
  text: {
    fontFamily: fontFamilies.moderat,
    fontSize:fontSize.small,
    padding:getHeight(3),
    marginBottom:getHeight(5)
  },
 
});
