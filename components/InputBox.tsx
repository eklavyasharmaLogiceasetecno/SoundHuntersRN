import React from "react";
import { ReturnKeyTypeOptions, StyleSheet, TextInput } from "react-native";
import { useTheme } from "../theme";

interface InputBoxProps {
  hint?: string;
  style?: any;
  handleTextChange?: (text: string) => void;
  backgroundColor?:string;
  secureTextEntry?:boolean;
  returnType?: ReturnKeyTypeOptions | undefined
  

}

const InputBox = (props: InputBoxProps): React.ReactElement => {
  const { hint, style, handleTextChange,secureTextEntry,returnType, ...otherProps } = props;
  const { colors } = useTheme();
  return (
    <TextInput
      style={{
        ...styles.input,
        ...style,
        color: colors.text,
        backgroundColor:colors.inputBoxBackground
      }}
      underlineColorAndroid="transparent"
      placeholder={hint}
      placeholderTextColor={colors.searchplaceholdercolor}
      autoCapitalize="none"
      onChangeText={handleTextChange}
      secureTextEntry={secureTextEntry}
      returnKeyType={returnType}
      {...otherProps}
    />
  );
};

export default InputBox;

const styles = StyleSheet.create({
  input: {
    padding: 10,
  },
});
