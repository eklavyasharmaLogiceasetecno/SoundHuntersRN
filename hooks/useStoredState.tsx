import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_USER_DETAILS = "userdetails";

export const saveUserDetails = async (
  userDetails: UserProfile
): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEY_USER_DETAILS,
    JSON.stringify(userDetails)
  );
};

export const getUserDetails = async (): Promise<UserProfile | null> => {
  const userDetails = await AsyncStorage.getItem(STORAGE_KEY_USER_DETAILS);

  if (userDetails != null) {
    return JSON.parse(userDetails) as UserProfile;
  }

  return null;
};

export const removeDetails = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY_USER_DETAILS);
};
