import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { err } from "react-native-svg/lib/typescript/xml";

const auth = getAuth();
export const getUser = () => auth.currentUser;

export const signUp = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  let res: AuthResponse = {
    isSuccess: false,
    error: "",
    uid: "",
  };
  try {
    let response = await createUserWithEmailAndPassword(auth, email, password);
    res.isSuccess = true;
    res.uid = response.user.uid;
  } catch (error) {
    if (error === undefined) {
      res.isSuccess = false;
      res.error = "Error in SignUp. Please Check Internet Connection!";
    } else {
      res.isSuccess = false;
      res.error = "Error in SignUp. EmailId Already In Use";
    }
  }

  return res;
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  let res: AuthResponse = {
    isSuccess: false,
    error: "",
    uid: "",
  };
  try {
    let response = await signInWithEmailAndPassword(auth, email, password);
    console.error('RESPONSE ', JSON.stringify(response))
    res.isSuccess = true;
    res.uid = response.user.uid;
  } catch (error) {
    res.isSuccess = false;
    res.error = "Error in SignIn.";
  }

  return res;
};

export const signOut = () => auth.signOut();
