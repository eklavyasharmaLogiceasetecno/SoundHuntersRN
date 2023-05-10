import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  getFirestore,
} from "firebase/firestore/lite";
import React, { createContext, useContext, useState, useEffect } from "react";
import { app } from "../config/firebaseconfig";
import useStoredState, { getUserDetails } from "../hooks/useStoredState";

const STORAGE_KEY_NEW_USER = "newUser";

interface UserInputProps {
  children: React.ReactNode;
}

interface UserReturnProps {
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (isOnboardingCompleted: boolean) => void;
  userProfile?: UserProfile;
  setUserProfile: (userProfile: UserProfile) => void;
  saveUserProfile: (extraFields?: Partial<UserProfile>) => Promise<string>;
  getUserProfile: (username: string) => Promise<UserProfile>;
  getStoredDetails: () => Promise<boolean>;
  updateUserProfile: (
    userId: string,
    name: string,
    bio: string,
    picture?: string
  ) => Promise<string>;
  //userLocation?: Coordinates
}

export const UserContext = createContext<Partial<UserReturnProps>>({});

export const UserContextProvider = (
  props: UserInputProps
): React.ReactElement => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const database = getFirestore(app);
  // const [userLocation] = useGeolocation()

  const getStoredDetails = async (): Promise<boolean> => {
    let userdetails = await getUserDetails();

    if (userdetails != null) {
      setIsOnboardingCompleted(true);

      const data = await getUserProfile?.(userdetails.userid);
      setUserProfile(data as UserProfile);

      return true;
    }
    setIsOnboardingCompleted(false);
    return false;
  };

  const getUserProfile = async (userid: string): Promise<UserProfile> => {
    const q = query(
      collection(database, "users"),
      where("userid", "==", userid)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot?.docs?.[0]?.data() as UserProfile;
  };

  const saveUserProfile = async (
    userFields?: Partial<UserProfile>
  ): Promise<string> => {
    try {
      setUserProfile(userFields as UserProfile);

      const docRef = await addDoc(collection(database, "users"), {
        email: userFields?.email,
        primarylanguage: userFields?.primarylanguage,
        profilepicture: userFields?.profilepicture,
        username: userFields?.username,
        userid: userFields?.userid,
      });
      console.log("Document written with ID: ", docRef.id);

      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error while Saving");
    }
  };

  const updateUserProfile = async (
    userId: string,
    name: string,
    bio: string,
    picture?: string
  ): Promise<string> => {
    try {
      setUserProfile({
        ...(userProfile as UserProfile),
        fullname: name,
        // biodata: bio,
        profilepicture: picture,
      });

      const q = query(
        collection(database, "users"),
        where("userid", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      console.log("id is ", querySnapshot?.docs?.[0].id);

      await updateDoc(doc(database, "users", querySnapshot?.docs?.[0].id), {
        fullname: name,
        // biodata: bio,
        profilepicture: picture,
      });

      return "success";
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error while Saving");
    }
  };

  const userContext: UserReturnProps = {
    isOnboardingCompleted,
    setIsOnboardingCompleted,
    saveUserProfile,
    userProfile,
    getUserProfile,
    setUserProfile,
    getStoredDetails,
    updateUserProfile,
  };

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};

export const { Consumer: UserContextConsumer } = UserContext;

export const useUser = (): Partial<UserReturnProps> => useContext(UserContext);
