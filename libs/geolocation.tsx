/*
  Lat: 59.318 → 59.319 = ~250 m
  Lon: 18.06 → 18.07 = ~700 m, 18.065 → 066 = ~55 m
*/
// export const DEFAULT_LOCATION = { latitude: 30.3752, longitude:  76.7821 }
// export const DEFAULT_LOCATION = { latitude: 48.5216, longitude:  9.0576 } // @Neha LatLng of Location Tübingen (Germany)
export const DEFAULT_LOCATION = { latitude: 48.5201475, longitude:  9.0529081 } // @Neha LatLng of Location Tübingen (Germany)

// Calculate geographic distance in meters – https://stackoverflow.com/a/21623206/449227
export function geoDistance (coord1: Coordinates, coord2: Coordinates): number {
  const p = 0.017453292519943295 // Math.PI / 180
  const a = 0.5 - Math.cos((coord2.latitude - coord1.latitude) * p) / 2 +
    Math.cos(coord1.latitude * p) * Math.cos(coord2.latitude * p) *
    (1 - Math.cos((coord2.longitude - coord1.longitude) * p)) / 2
  return Math.round(1000 * 12742 * Math.asin(Math.sqrt(a))) // 2 * R; R = 6371 km
}

// A string that can be used e.g. in hook dependencies
export const createLocationReference = (lat = 59.0, lng = 18.0): string => `${lat.toFixed(3)},${lng.toFixed(2)}`
