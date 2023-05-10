import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Platform, SafeAreaView, StyleSheet,TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import Button from "../components/Button";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import {
  LOGINTEXT, APPTITLE,TITLEHEADER,RECORDSOUNDS,SEARCHSONGS,SHARESOUNDS,GETSTARTED} from "../strings/en";
import { useTheme } from "../theme";
import { fontSize } from "../theme/fontSize";
import TextView from "../components/TextView";
import { getHeight, getWidth } from "../libs/styleHelper";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import Loader from "../components/Loader";
import fontFamilies from '../theme/fontfamilies'
import { Audio, Video } from 'expo-av';
import {Text} from 'react-native'

export default function IntroScreen(): React.ReactElement {
 void SplashScreen.hideAsync();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef();
  const [swiperIndex, setSwiperIndex] = useState(0);
  const swiperRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = swiperIndex === data.length - 1 ? 0 : swiperIndex + 1;
      setSwiperIndex(nextIndex);
      swiperRef.current.scrollTo(nextIndex);
    }, 3000); // Change the delay time as per your requirement
    return () => clearTimeout(timer);
  }, [swiperIndex]);
  const data = [SHARESOUNDS, SEARCHSONGS, RECORDSOUNDS];
  const onPressNextButton = async () => {
    navigation.navigate(NavigationRoutes.CreateUserName as never);
  };
  const onPressLogin = async () => {
    navigation.navigate(NavigationRoutes.LOGIN as never);
  };
  const handleVideoEnd = async () => {
    // Seek the video to the beginning
    await videoRef.current.setPositionAsync(0);
    // Play the video again
    setIsPlaying(true);
  };
  const FadeInView = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false
        }
      ).start();
    }, [fadeAnim]);
    return (
      <Animated.View
        style={{
          ...props.style,
          opacity: fadeAnim,
        }}
      >
        {props.children}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, { backgroundColor: colors.background }]}>
        {isDark === true? <FocusAwareStatusBar barStyle="light-content" />:null}
        <View style={[styles.logoContainer,{
            height:Platform.OS === "ios"?80:"20%"
          }]}>
            {isDark === true ? (
              <Image
                source={require("../assets/appheader_dark.png")}
                style={styles.logoStyle}
              />
            ) : (
              <Image
                source={require("../assets/appheader_light.png")}
                style={styles.logoStyle}
              />
            )}
          </View>
          <View style={styles.titleContainer}>
            <TextView text={TITLEHEADER} style={styles.titleHeaderStyle} />
            <TextView text={APPTITLE} style={styles.titleStyle} />
          </View>
          <Video
  source={require("../assets/appMovie.mov")}
  resizeMode={"cover"}
  style={{width:'75%', height:'35%',}}
  shouldPlay={isPlaying}
  ref={videoRef}
  onPlaybackStatusUpdate={(status) => {
    // If the video has ended, call handleVideoEnd to restart it
    if (status.didJustFinish) {
      handleVideoEnd();
    }
  }}
/>
      <FadeInView style={{height:getHeight(100),marginTop:getHeight(10)}}>
      <Swiper  ref={swiperRef}
        loop={false}
        dotColor={colors.primarytextcolor}
        activeDotColor={colors.tabactiveTintColor}
        index={swiperIndex}
        onIndexChanged={(index) => setSwiperIndex(index)}
        >
             {data.map((slide) => (
          <View key={slide}>
        {/* <TextView text={RECORDSOUNDS} style={{ ...styles.textstyle }} />
            <TextView text={SHARESOUNDS} style={{ ...styles.textstyle }} />
            <TextView text={SEARCHSONGS} style={{ ...styles.textstyle }} /> */}
            <Text  style={{...styles.textstyle,color:colors.primarytextcolor,top:getHeight(10)}}>{slide}</Text>
         </View>
        ))}
      </Swiper>
      </FadeInView>
      <View>
        <Button
          title={GETSTARTED}
          onPress={onPressNextButton}
          style={styles.button}
        />
        <TouchableOpacity  onPress={onPressLogin}>
          <TextView text={LOGINTEXT} style={styles.loginText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: getHeight(20),
  },
  textContainer: {
    height: '10%',
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    height:'22%',
  },
  titleStyle: {
    fontSize: fontSize.maximum,
  },
  titleHeaderStyle: {
    fontSize: fontSize.small,
    fontWeight: "700",
    // fontFamily: fontFamilies.moderat,
  },
  textstyle: {
    fontSize: fontSize.medium,
    fontWeight: "bold",
    textAlign: "center",
    // fontFamily: fontFamilies.moderat
  },
  logoStyle: {
    resizeMode:"contain",
    width:getWidth(170)
  },
  button: {
    width: getWidth(285),
    height:getHeight(55),
    alignItems: "center",
    justifyContent:'center'
  },
  loginText: {
    fontSize: fontSize.extrasmall,
    textAlign: "center",
    marginTop:getHeight(10),
    marginBottom:getHeight(20),
    //  fontFamily: fontFamilies.moderat,
      fontWeight: "400",
  },
  
});