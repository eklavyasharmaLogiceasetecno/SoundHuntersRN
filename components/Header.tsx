import React from 'react'
import { View,StyleSheet } from 'react-native'
import { getHeight, getWidth } from '../libs/styleHelper';
import fontFamilies from '../theme/fontfamilies';
import { fontSize } from '../theme/fontSize';
import TextView from './TextView';
import { useTheme } from "../theme";

interface HeadingProps {
    title: string;
    discription: string;
  }

  const Header = (props:HeadingProps):React.ReactElement =>{
    const { title,discription  } = props;
     const { colors } = useTheme();

    return(
        <View style={styles.userNameHeadingView}>
        <TextView text={props.title} style={styles.headingStyle} />
        <TextView text={props.discription} style={styles.subheadingstyle} color={colors.subheadtextcolor}/>
      </View>
    );
  }

  export default Header

  const styles=StyleSheet.create({
    subheadingstyle: {
        fontWeight: "400",
        fontFamily: fontFamilies.moderatLight,
        fontSize:fontSize.extrasmall,
        color:"red"
        
      },
      userNameHeadingView: {
        alignItems: "center",
        fontFamily: fontFamilies.roboto,
      },
      headingStyle: {
        fontSize: fontSize.large,
        textAlign: "center",
        fontWeight: "700",
         fontFamily: fontFamilies.moderat
      },
      chooseLanguage: {
        textAlign: "center",
        fontWeight: "400",
        fontFamily: fontFamilies.roboto
      },
      languageHeadingView: {
        width: getWidth(400),
         height: getHeight(35),
         flex: 0.4,
         justifyContent: "center",
         margin: getWidth(10),
         fontFamily: fontFamilies.moderat
       },
       selectLanguage: {
         fontSize: fontSize.maximum,
       },
  })

  