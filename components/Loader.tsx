import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../theme";


const Loader = () => {
  const {colors,isDark} = useTheme()
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        opacity: 0.5,
        position: "absolute",
        zIndex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: "40%",
          alignSelf: "center",
        }}
      >
    <ActivityIndicator size="large" color={colors.primarytextcolor} />

      </View>
    </View>
  );
};

export default Loader;
