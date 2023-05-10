import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme";
import fontFamilies from '../theme/fontfamilies'

interface ButtonProps {
  title?: string;
  style?: any;
  fontSize?: any;
  TextColor?: string;
  backgroundColor?:any;
  disabled?:any;
  onPress?: () => void;
}

const Button = (props: ButtonProps): React.ReactElement => {
  const { title, style, onPress,fontSize,TextColor,backgroundColor,disabled, ...otherProps } = props;
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      {...otherProps}
      style={[
       styles.button,
        style,
        {backgroundColor:backgroundColor?? colors.buttonBackground}
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{...styles.text,color:TextColor??colors.buttonText, fontSize:fontSize ?? 18 }}>{title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems:'center',
    borderRadius:7
  },
  text: {
   fontFamily:fontFamilies.moderat,
    fontWeight:"700"
  },
});
