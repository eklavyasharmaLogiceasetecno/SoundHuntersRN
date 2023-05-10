import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Audio } from "expo-av";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import TextView from "../components/TextView";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import StopSound from "../assets/stopSound.svg";
import RecordSound from "../assets/recordSound.svg";
import CancelButton from "../assets/cancelButton.svg";
import { getHeight, getWidth } from "../libs/styleHelper";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";
import { EDITSOUND, SAVESOUND } from "../strings/en";
import Button from "../components/Button";

export default function RecordAudio(): React.ReactElement {
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [timer, setTimer] = React.useState<any>(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPlaying, setIsPlaying] = React.useState<boolean>();
  const navigation = useNavigation();
  const { colors } = useTheme();

  React.useEffect(() => {
    let interval: any;
    if (recording && isPlaying) {
      interval = setInterval(() => {
        setTimer((prevTimer: any) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording, !isPlaying]);

  const startRecording = async () => {
    try {
      resetTimer();

      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      setIsDisabled(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);
    setIsDisabled(false);
    setIsPlaying(false);
  };

  async function onPressCrossButton() {
    await stopRecording();
    resetTimer();
    navigation.navigate(NavigationRoutes.Home as never);
    setIsDisabled(true);
    setIsPlaying(false);
  }
  function onPressEditSound() {
    navigation.navigate(NavigationRoutes.EditSound, {
      recordedsound: recording,
    });
    setIsDisabled(true);
    resetTimer();
    setRecording(undefined);
  }

  function resetTimer() {
    setTimer(0);
  }

  const onPressPlayRecord = () => {
    console.log("Selected", isPlaying);

    if (isPlaying) {
      stopRecording();
    } else {
      startRecording();
    }

    setIsPlaying(!isPlaying);
  };

  function formatTime(seconds: any) {
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `0${hours}:0${minutes}:${paddedSeconds}`;
  }

  async function onPressSaveScreen() {
    resetTimer();
    console.log("hello", recording);
    setIsDisabled(true);
    stopRecording();
    navigation.navigate(NavigationRoutes.SoundDescription, {
      recordedsound: recording?.getURI(),
    });
    setRecording(undefined);
    //  navigation.navigate(NavigationRoutes.SoundDescription,{})
  }

  const renderPlayPause = () => {
    return isPlaying ? (
      <StopSound height={50} width={60} />
    ) : (
      <RecordSound height={50} width={50} />
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />

      <View style={styles.crossAndEditButtonView}>
        <TouchableOpacity
          style={{ alignItems: "flex-start" }}
          onPress={onPressCrossButton}
        >
          <CancelButton height={15} width={15} />
        </TouchableOpacity>
        {/**TODO Hide EditSound Temporarily */}
        <TouchableOpacity
          style={{ alignItems: "flex-end", opacity: isDisabled ? 0.5 : 1 }}
          onPress={onPressEditSound}
          disabled={isDisabled}
        >
          <TextView text={EDITSOUND} style={styles.textStyle} />
        </TouchableOpacity>
      </View>
      <View style={{ ...styles.timerContainer }}>
        <Text
          style={{
            ...styles.timerTextStyle,
            color: timer === 0 ? colors.text : "#E6A6AD",
          }}
        >
          {formatTime(timer)}
        </Text>
      </View>
      <View style={{ ...styles.buttonView, borderColor: colors.text }}>
        <View style={styles.buttonViewContainer}>
          <TouchableOpacity
            onPress={() => {
              onPressPlayRecord();
            }}
          >
            {renderPlayPause()}
          </TouchableOpacity>
          <View style={{ top: getHeight(20) }}>
            <Button
              title={SAVESOUND}
              onPress={onPressSaveScreen}
              style={{ opacity: isDisabled ? 0.6 : 1 }}
              disabled={isDisabled}
              fontSize={14}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
  },
  crossAndEditButtonView: {
    height: "20%",
    justifyContent: "center",
    padding: getHeight(20),
    bottom: getHeight(20),
    marginTop: getHeight(10),
  },
  textStyle: {
    color: "#fff",
    bottom: getHeight(20),
    fontSize: fontSize.small,
    fontWeight: "700",
    fontFamily: fontFamilies.moderat,
  },
  buttonView: {
    alignItems: "center",
    borderTopWidth: 0.5,
    height: "35%",
    width: "100%",
    justifyContent: "flex-start",
    borderTopColor: "#D6CAB6",
    padding: 10,
  },
  buttonViewContainer: {
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "30%",
  },
  timerTextStyle: {
    fontSize: fontSize.extralarge,
    fontFamily: fontFamilies.moderat,
    fontWeight: "700",
  },
  button: {
    width: getWidth(285),
    height: getHeight(55),
    alignItems: "center",
    justifyContent: "center",
  },
});
