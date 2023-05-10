import React from "react";
import * as SplashScreen from "expo-splash-screen";

import RootNavigator from "./navigation/RootNavigator";
import useloadResources from "./libs/useloadResources";
import { ThemeProvider } from "./theme";
import { UserContextProvider } from "./hooks/useUser";
import { AlbumContextProvider } from "./hooks/useAlbums";
import { enableScreens } from "react-native-screens";
enableScreens();

// Keep the splash screen visible while we load videos
void SplashScreen.preventAutoHideAsync();

export default function App(): React.ReactElement {
  const [fontLoad, setFontLoad] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      await useloadResources();
      setFontLoad(true);
    })();
  }, []);

  if (!fontLoad) return <></>;

  return (
    <ThemeProvider>
      <UserContextProvider>
        <AlbumContextProvider>
          <RootNavigator />
        </AlbumContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
}
