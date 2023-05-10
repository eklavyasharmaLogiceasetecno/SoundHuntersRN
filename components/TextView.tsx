import React from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "../theme";

interface TextViewProps {
  text?: any;
  style?: any;
  color?: any;
  numberOfLines?: number;
}

const TextView = (props: TextViewProps): React.ReactElement => {
  const { text, style, color, numberOfLines, ...otherProps } = props;
  const { colors } = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        ...styles.textstyle,
        ...style,
        color: color ? color : colors.primarytextcolor,
      }}
      accessibilityRole="header"
    >
      {text}
    </Text>
  );
};

export default TextView;

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 12,
  },
});
