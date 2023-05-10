import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as React from "react";
import fontFamilies from "../theme/fontfamilies";
// import fontFamilies from "../theme/fontFamilies";

export default async function useloadResources() {
  // const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  // React.useEffect(() => {
    // async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        return await Font.loadAsync({
          ...Ionicons.font,
          [fontFamilies.moderat]: require("../assets/fonts/Moderat-Black.ttf"),
          [fontFamilies.roboto]: require("../assets/fonts/Roboto-Regular.ttf"),
          [fontFamilies.nunito]: require('../assets/fonts/Nunito-Regular.ttf'),
          [fontFamilies.moderatLight]: require('../assets/fonts/Moderat-Light.ttf')
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        // console.warn(e)
      } finally {
        // setLoadingComplete(true);
      }
    // }

    // loadResourcesAndDataAsync();
  // }, []);

  // return isLoadingComplete;
}

