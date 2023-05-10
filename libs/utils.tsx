import { Alert } from "react-native";
import { Platform, ToastAndroid } from "react-native";

export const generateRandomName =() =>  {
let randomstring=Math.random().toString(36).slice(2);


return randomstring;

}
export function toastMessage(msg: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      Alert.alert(msg)
    }
  }