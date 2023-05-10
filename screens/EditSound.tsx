import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import TextView from "../components/TextView";
import { EDITSOUND, EFFECT, SAVE, VOLUME } from "../strings/en";
import { useTheme } from "../theme";
import ArrowIcon from "../assets/arrowIcon.svg";
import ArrowIconDark from "../assets/arrowIconDark.svg";
import NoFilter from "../assets/NoFilter.svg";
import NoFilterDark from "../assets/noFilterDark.svg";
import Filter1 from "../assets/Filter1.svg";
import Filter2 from "../assets/Filter2.svg";
import Filter3 from "../assets/Filter3.svg";
import Filter4 from "../assets/Filter4.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import fontFamilies from "../theme/fontfamilies";
import { fontSize } from "../theme/fontSize";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import RecordSound from "../assets/recordSound.svg";
import StopSound from "../assets/stopSound.svg";

export default function EditSound() {
  const route = useRoute();
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [sound, setSound] = React.useState<any>(null);
  const [selectedFilter, setSelectedFilter] = React.useState<any>(-1);
  const [isPlaying, setIsPlaying] = React.useState<boolean>();
  const [recording, setRecording] = React.useState<Audio.Recording>(
    route.params?.recordedsound
  );
  const [newRecording, setnewRecording] = React.useState<string>("");
  const [rate, setRate] = React.useState<number>();
  const [pitch, setPitch] = React.useState<number>();
  const [volume, setVolume] = React.useState<number>(-1);

  const [isPressed, setIsPressed] = useState(false);
  const animationRef = React.useRef<LottieView>(null);

  useFocusEffect(() => {
    soundwavePause();
  });

  const soundwavePause = () => {
    animationRef.current?.pause();
  };

  const soundwavePlay = () => {
    animationRef.current?.play();
  };

  async function playAudio() {
    
    if (isPlaying) {
      stopAudio();
    }
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: recording.getURI(),
      });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status: any) => {
        if (status.didJustFinish == true) {
          setIsPlaying(false);
          await stopAudio();
        }
      });
      await newSound.setVolumeAsync(volume==-1?1:volume)

      await onSelectAudioFilter(newSound);
      await newSound.playAsync();
      soundwavePlay();
    } catch (error) {}
  }

  // async function setVolume(volume: number) {
  //   try {
  //     await sound.setVolumeAsync(volume);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function onPressSaveScreen() {
    setRecording(undefined);
    // setnewRecording()
    // setnewRecording("");
    navigation.navigate(NavigationRoutes.SoundDescription, {
      recordedsound: recording._uri,
      rate:rate,
      pitch:pitch,
      volume:volume<0?1:volume,
    });
  }
  async function stopAudio() {
    if (sound !== null) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
      setSound(null);
      soundwavePause();
    }
  }

  const onPressPlayRecord = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  const renderPlayPause = () => {
    return isPlaying ? (
      <StopSound height={40} width={40} />
    ) : (
      <RecordSound height={40} width={40} />
    );
  };

  const onPressBackButton = async () => {
    await stopAudio();
    navigation.navigate(NavigationRoutes.UserProfile as never);
  };
  const filterFastSpeed = async (sound: Audio.Sound) => {
    // Load the sound from a remote URL
    //
    // await soundObject.playAsync();
    // setIsPlaying(true)
    setRate(3)
    setPitch(1.5)
    await sound.setRateAsync(3, true, 1.5);
    const status = await sound.getStatusAsync();
   
    // Get the new URI for the audio file with the updated rate
    // const newUri = status?.isLoaded ? status?.uri : null;
    // setnewRecording(newUri?.toString());
  };
  async function filterSlowSpeed(sound: Audio.Sound) {
    try {
      await sound.setRateAsync(0.5, true); 
      setRate(0.5)
      // await soundObject.playAsync();
    } catch (error) {}
  }
  async function addLoopToSound(soundObject: Audio.Sound) {
    try {
      // const soundObject = new Audio.Sound();
      // await soundObject.loadAsync({  uri: soundObject.getURI()});
      await soundObject.setIsLoopingAsync(true);
      // await soundObject.playAsync();
    } catch (error) {}
  }
  const filterBass = async (sound: Audio.Sound) => {
    const eqParams = [
      { frequency: 60, qFactor: 1.5, gain: 6 }, // Boost low frequencies
      { frequency: 150, qFactor: 1.5, gain: 0 }, // Leave mid frequencies unchanged
      { frequency: 1000, qFactor: 1.5, gain: 0 }, // Leave mid frequencies unchanged
      { frequency: 4000, qFactor: 1.5, gain: 0 }, // Leave high frequencies unchanged
      { frequency: 10000, qFactor: 1.5, gain: 0 }, // Leave high frequencies unchanged
    ];

    await sound.playAsync();
  };
  const filterBassSound = async () => {
    try {
      const bassGain = 6;
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: recording.getURI() });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(
        sound._loaded._nativeAudioElement
      );

      const bassFilter = audioContext.createBiquadFilter();
      bassFilter.type = "lowshelf";
      bassFilter.frequency.setValueAtTime(150, audioContext.currentTime);
      bassFilter.gain.setValueAtTime(bassGain, audioContext.currentTime);

      source.connect(bassFilter);
      bassFilter.connect(audioContext.destination);

      await soundObject.playAsync();
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.uri) {
          const uri = status.uri;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addEqToSound = async (soundObject: Audio.Sound) => {
    try {
      // const soundObject = new Audio.Sound();
      // await soundObject.loadAsync({ uri:recording.getURI()});
      const initialStatus = await soundObject.getStatusAsync();
      const newStatus = {
        ...initialStatus,
        shouldCorrectPitch: true,
        audioPan: -1,
        isMuted: false,
        rate: 0.0,
        bands: [
          { frequency: 60, decibels: 6, filterType: "lowshelf" },
          { frequency: 250, decibels: 3, filterType: "peaking" },
          { frequency: 500, decibels: -3, filterType: "peaking" },
          { frequency: 1000, decibels: -6, filterType: "peaking" },
          { frequency: 2000, decibels: -3, filterType: "peaking" },
          { frequency: 4000, decibels: 3, filterType: "peaking" },
          { frequency: 8000, decibels: 6, filterType: "highshelf" },
        ],
      };

      await soundObject.setStatusAsync(newStatus);
      await soundObject.playAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectAudioFilter = async (sound: Audio.Sound) => {
    switch (selectedFilter) {
      case 0:
        await sound.playAsync();
        setnewRecording(route.params?.recordedsound);
        break;
      case 1:
        filterFastSpeed(sound);

        break;
      case 2:
        filterBassSound();
        break;
      case 3:
        filterSlowSpeed(sound);
        break;
      case 4:
        addEqToSound(sound);
        break;
      case 5:
        addLoopToSound(sound);
        break;
    }
  };

  // const renderFilterView =[ {
  // icon: <NoFilter height={66} width={56}/>
  // }]

  const soundWavesAnimationList = [
    {
      name: require("../assets/audioWave.json"),
    },

    {
      name: require("../assets/soundWave1.json"),
    },
    {
      name: require("../assets/red_sound_waves.json"),
    },
    {
      name: require("../assets/red_sound_waves.json"),
    },
    {
      name: require("../assets/audioWave.json"),
    },
  ];

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <View style={styles.arrowIconStyle}>
        <TouchableOpacity onPress={onPressBackButton}>
          {isDark !== true ? <ArrowIcon /> : <ArrowIconDark />}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSaveScreen}>
          <TextView
            text={SAVE}
            style={{ ...styles.buttonStyle, color: colors.commontextcolor }}
          />
        </TouchableOpacity>
      </View>
      <TextView text={EDITSOUND} style={styles.heading} />
      <View
        style={{
          ...styles.lottieViewStyle,
          borderBottomColor: colors.borderColor,
        }}
      >
        <LottieView
          source={
            soundWavesAnimationList[selectedFilter < 0 ? 0 : selectedFilter]
              .name
          }
          ref={animationRef}
          autoPlay={selectedFilter < 0 ? false : true}
          loop={selectedFilter < 0 ? false : true}
        />
      </View>
      <View style={styles.iconStyle}>
        <TouchableOpacity
          onPress={() => {
            onPressPlayRecord();
          }}
        >
          {renderPlayPause()}
        </TouchableOpacity>
      </View>
      <View
        style={{
          ...styles.seekbarStyle,
          backgroundColor: colors.cardComponentColor,
        }}
      >
        <View style={styles.sliderViewStyle}>
          <TextView text={VOLUME} style={styles.seekbarTextStyle} />
          <Slider
            style={{ width: getWidth(300), height: getHeight(40) }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#67DCCB"
            maximumTrackTintColor="#CFC3B0"
            step={0.1}
            value={1}
            onValueChange={(value) => {
              if(value===0)
              setVolume(0.3);
              else setVolume(volume)
            }}
          />
        </View>
         
        {/* 
       @Neha Temporarily hide the Effect slider

        <View style={styles.sliderViewStyle}>
          <TextView text={EFFECT} style={styles.seekbarTextStyle} />
          <Slider
            style={{ width: getWidth(300), height: getHeight(40) }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#67DCCB"
            maximumTrackTintColor="#CFC3B0"
          />
        </View> */}
      </View>

      <View style={styles.EffectButtonView}>
        {/* {renderFilterView.map((item, index) => {
    return (
<TouchableOpacity onPress={()=>setSelectedFilter(index)} style={{borderColor:  selectedFilter === index? 'red' : '#67DCCB' ,borderWidth:2}}>
{item.icon}
</TouchableOpacity>
    )
  })} */}
        <TouchableOpacity
          onPress={() => setSelectedFilter(0)}
          style={{
            borderColor: selectedFilter === 0 ? "#67DCCB" : "transparent",
            borderWidth: 2,
            borderRadius: getHeight(5),
            left:getHeight(25)
          }}
        >
       {isDark !== true ? (
      <NoFilter height={66} width={56} />
      ) : (
        <NoFilterDark height={66} width={56} />
      )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedFilter(1)}
          style={{
            borderColor: selectedFilter === 1 ? "#67DCCB" : "transparent",
            borderWidth: 2,
            borderRadius: getHeight(5),
            marginHorizontal: getHeight(30),
          }}
        >
          <Filter1 height={66} width={56} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setSelectedFilter(2)}
          style={{
            borderColor: selectedFilter === 2 ? "#67DCCB" : "transparent",
            borderWidth: 2,
            borderRadius: getHeight(5),
          }}
        >
          <Filter2 height={66} width={56} />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => setSelectedFilter(3)}
          style={{
            borderColor: selectedFilter === 3 ? "#67DCCB" : "transparent",
            borderWidth: 2,
            borderRadius: getHeight(5),
            right:getHeight(25)
          }}
        >
          <Filter3 height={66} width={56} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => setSelectedFilter(4)}
          style={{
            borderColor: selectedFilter === 4 ? "#67DCCB" : "transparent",
            borderWidth: 2,
            borderRadius: getHeight(5),
          }}
        >
          <Filter4 height={66} width={56} />
        </TouchableOpacity>
         */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getWidth(20),
  },
  cardView: {
    paddingHorizontal: getWidth(20),
    paddingBottom: getHeight(20),
  },
  arrowIconStyle: {
    height: "8%",
    justifyContent: "space-between",
    paddingBottom: getHeight(10),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  buttonStyle: {
    fontWeight: "700",
    fontFamily: fontFamilies.moderat,
    fontSize: fontSize.medium,
    top: getHeight(8),
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
    paddingBottom: getHeight(20),
  },
  iconStyle: {
    alignItems: "center",
    marginTop: getHeight(20),
  },
  seekbarStyle: {
    paddingLeft: getWidth(20),
    marginTop: getHeight(20),
  },
  seekbarTextStyle: {
    fontSize: fontSize.extrasmall,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  lottieViewStyle: {
    height: "55%",
    width: getWidth(450),
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: getWidth(0.7),
  },
  sliderViewStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  EffectButtonView: {
    flexDirection: "row",
    marginTop: getHeight(20),
    justifyContent: "center",
  },
});
