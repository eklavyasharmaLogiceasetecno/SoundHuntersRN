import React, { LegacyRef, useRef, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Camera, Circle, Marker } from "react-native-maps";
import { useTheme } from "../theme";
import MapMarker from "../assets/mapMarker.svg";
import { getInitialMapRegion } from "../hooks/useGeolocation";
import { useAlbums } from "../hooks/useAlbums";
import { getHeight, getWidth } from "../libs/styleHelper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import NavigationRoutes from "../navigation/constants/NavigationRoutes";
import CancelButton from "../assets/cancelButton.svg";
import Slider from 'react-native-slider'
import Button from "../components/Button";
import { fontSize } from "../theme/fontSize";
import fontFamilies from "../theme/fontfamilies";




const LocationMap = (): React.ReactElement => {
  const { userLocation, albumList } = useAlbums();
  // @Dev Get data via search album screen
  const route = useRoute();
  const searchedAlbumList: Album[] = [];
  searchedAlbumList.push(route.params?.searchedAlbumList);
  const { colors } = useTheme();
  const step=1;

  const [followUser, setFollowUser] = useState(true);
  const [isFromHome, setNavigationScreen] = useState(true);
  const [region, setRegion] = useState();
  const navigation = useNavigation();
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderPrevValue, setSliderPrevValue] = useState(0);
  const [disableMap, setDisableMap] = useState(false);
  const map: LegacyRef<MapView> = useRef(null);


  useFocusEffect(
    React.useCallback(() => {
      //@Dev Update location according to search
      if (route.params?.searchedAlbumList) {
        userLocation.latitude =
          route.params?.searchedAlbumList.location.latitude;
        userLocation.longitude =
          route.params?.searchedAlbumList.location.longitude;
        setNavigationScreen(false);
      }
    }, [])
  );
  const initialMapRegion = getInitialMapRegion(userLocation, true);
  
  const onPressBackButton = async () => {
    navigation.navigate(NavigationRoutes.Home as never);
  };
  const onPressMarker = (album: Album) => {
    navigation.navigate(NavigationRoutes.MusicPlayer, { musicitem: album });
  };
  const handleSliderChange = () => {
    
   map.current?.getCamera().then((cam: Camera) => {
    if(sliderValue>sliderPrevValue)
    cam.zoom += 3;
    else
    cam.zoom -= 3;
    setSliderPrevValue(sliderValue)
    if(sliderValue!==sliderPrevValue){
    map?.current?.animateToRegion(initialMapRegion, 1)
    map?.current?.animateCamera(cam);
    }
});
};

  const onPressInHandler = () => {
    setTimeout(() => {
      setDisableMap(true);
    }, 20); // set the delay time in milliseconds
  };
  const onPressOutHandler = () => {
    setDisableMap(false);
  };
  return (
    <View style={{ ...styles.container }} >
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <MapView
      ref={map}
        style={{ ...styles.map }}
        userInterfaceStyle={"dark"}
        initialRegion={initialMapRegion}
        region={region}
        // onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        followsUserLocation={followUser}
        zoomEnabled={true}
        zoomTapEnabled={true}
        maxZoomLevel={100}
        scrollEnabled={!disableMap}
      >
        {(isFromHome ? albumList : searchedAlbumList ?? [])?.map(
          (album, index) => (
            <Marker
              key={index}
              // icon={require("../assets/icon.png" )}
              title={album.title}
              description={album.description}
              coordinate={{
                latitude: album.location.latitude,
                longitude: album.location.longitude,
              }}
              draggable={true}
              onPress={() => onPressMarker(album)}
            >
              <MapMarker height={30} width={30} />
            </Marker>
          )
        )}
        <Circle
          //  center={{ latitude: 30.3752, longitude: 76.7821 }}
          center={{
            latitude: userLocation
              ? userLocation.latitude
              : initialMapRegion.latitude,
            longitude: userLocation
              ? userLocation.longitude
              : initialMapRegion.longitude,
          }}
          radius={100} // in meters
          strokeColor="#67DCCB"
          fillColor="rgba(103, 220, 203, 0.22)"
          strokeWidth={2}
        />
      </MapView>
      {/* <GooglePlacesAutocomplete
        placeholder="Type a place"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: "AIzaSyBlA1j4Jm52rU9toFyEacX5YklA6jJilUs",
          language: "en",
        }}
        styles={{
          textInput: {
            height: getHeight(50),
            fontSize: 16,
            top: getHeight(50),
            width: "90%",
            marginLeft: 20,
            marginRight: 20,
            position:'absolute'
          },
        }}
        currentLocation={true}
        currentLocationLabel="Current location"
        fetchDetails={true}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
      /> */}
      <View
        style={{
          alignItems: "center",
          marginRight: getHeight(20),
          marginTop: getHeight(20),
          height:getHeight(50),
          justifyContent:'flex-start',
          width:getWidth(50)
        }}
      >
        <TouchableOpacity style={{padding:10}}onPress={onPressBackButton}>
          <CancelButton height={20} width={30} />
        </TouchableOpacity>
      </View>
      <View style={{...styles.sliderView }}
      onTouchStart={() => onPressInHandler()} onTouchEnd={() => onPressOutHandler()}
      >
      <Slider
        minimumValue={0}
        maximumValue={100}
        step={step}

        onValueChange={setSliderValue}
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        minimumTrackTintColor="#B3DCD6"
        
        // onRegionChangeComplete={onRegionChange}
        // initialRegion={initialMapRegion}
        // region={region}
      />
      <Button title="Done" onPress={handleSliderChange} style={{width:getWidth(285),height:getHeight(53),top:10}} fontSize={fontSize.small} TextColor="#454D4B"/>
      </View>
    </View>
  );
};
export default LocationMap;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getHeight(20),
    justifyContent:'space-between',
  },
  mapMarkerStyle: {
    height: 30,
    width: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    opacity: 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  zindex:0
  },
  sliderView:{
    marginLeft:60,
    height:150,
    justifyContent:'flex-start',
    alignItems:'flex-end',
    width:255,
    zIndex:1,
    paddingVertical:getHeight(40)
  },
  track: {
    height: getHeight(12),
    backgroundColor: '#BDC3C7',
    width:getWidth(285)
  },
  thumb: {
    width: getWidth(14),
    height: getHeight(20),
    borderRadius: 0,
    backgroundColor: '#67DCCB',
  },
  }
);