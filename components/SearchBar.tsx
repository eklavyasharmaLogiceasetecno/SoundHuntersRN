import React, { useState } from "react";
import { ReturnKeyTypeOptions, TextInput, View } from "react-native";
import MusicSearchIcon from "../assets/musicSearchIcon.svg";
import CloseIcon from "../assets/closeIcon.svg";
import { useTheme } from "../theme";
import { getHeight, getWidth } from "../libs/styleHelper";
import { StyleSheet } from "react-native";
import fontFamilies from "../theme/fontfamilies";
import { lightColors } from "../theme/colors";
import InputBox from "./InputBox";
import Button from "./Button";
import { FIND, SEARCH,HINT } from "../strings/en";
import MusicSearchIconDark from "../assets/searchIconDark.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface SearchBarProps {
  hint?: string;
  handleTextChange?: (text: any) => void;
  onPressSearch?: () => void;
  onFocus?: () => void
  onSubmit?: () => void
  returnType?: ReturnKeyTypeOptions | undefined

  
}
const SearchBar = (props: SearchBarProps): React.ReactElement => {
  const { hint, handleTextChange, onPressSearch,onFocus,onSubmit,returnType, ...otherProps } = props;
  const { colors, isDark } = useTheme();
  const [text, setText] = useState<string>('')
  

  
  const clearInput = ()=>{setText('')
  //@Dev clear searched sudio list with search clear
  handleTextChange('')
}
  
  return (
    <View style={{...styles.textInput,backgroundColor:colors.cardbackground}}>

      {isDark !== true ?
        (<MusicSearchIcon style={styles.MusicSearchIcon}  />
        ):(
        <MusicSearchIconDark style={styles.MusicSearchIcon} />)}
      <TextInput
      placeholder={hint}
      placeholderTextColor={colors.searchplaceholdercolor}
      value={text}
      onChangeText={(text)=> {setText(text);handleTextChange(text)}}
      onFocus={onFocus}
      onSubmitEditing={onSubmit}
      style={{...styles.searchInput,color:colors.searchplaceholdercolor}}
      returnKeyType={returnType}
    />
      <TouchableOpacity onPress={clearInput}>
      <CloseIcon style={styles.closeIconStyle}/>
      </TouchableOpacity>
      
      <Button title={FIND} style={{ ...styles.button }} onPress={onPressSearch} TextColor={colors.searchresulttextcolor} backgroundColor={colors.tabactiveTintColor}/>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  MusicSearchIcon: {
    marginLeft: getWidth(10),
  },
  button: {
    justifyContent: "center",
    textAlign: "center",
    fontFamily: fontFamilies.moderat,
    height:"100%",
    fontWeight:'700'
  },
  searchInput: {
    width: "55%",
    paddingLeft:getHeight(10)
  },
  textInput: {
    width: "95%",
    height: getHeight(57),
    borderRadius: getHeight(10),
    marginTop: getHeight(10),
    flexDirection: "row",
    justifyContent:"space-around",
    alignItems: "center",
    alignSelf:'center',

  },
  closeIconStyle:{
    marginRight:getWidth(10),
    paddingRight:getWidth(20)
  }
});
