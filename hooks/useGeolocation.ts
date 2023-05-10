import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import { Region } from "react-native-maps";
import { DEFAULT_LOCATION } from "../libs/geolocation";

interface GeolocationReturnProps {
  0: Coordinates;
  1?: Error;
}

const useGeolocation = (): GeolocationReturnProps => {
  const [error, setError] = useState<Error>();
  const [location, setLocation] = useState<Coordinates>(DEFAULT_LOCATION);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("status is ", status);
    if (status !== "granted") {
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,

      timeInterval: 5,
    });

    setLocation(location.coords);
  }

  return [location, error];
};

export default useGeolocation;

export const getInitialMapRegion = (
  userLocation: Coordinates = DEFAULT_LOCATION,
  isDebug
): Region => {
  const { width, height } = Dimensions.get("window");
  const screenAspectRatio = width / height;
  const LATITUDE_DELTA = 0.02;
  const longitudeDelta = LATITUDE_DELTA * screenAspectRatio;
  const initialMapRegion = {
    latitude: isDebug ? DEFAULT_LOCATION.latitude : userLocation.latitude,
    longitude: isDebug ? DEFAULT_LOCATION.longitude : userLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: longitudeDelta,
  };
  return initialMapRegion;
};
