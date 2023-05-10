import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { getFirestore } from "firebase/firestore/lite";
const firebaseConfig = {
  apiKey: "AIzaSyD6RbYK7e49fT-Zhns2W4--g8FEfmPBpHg",
  authDomain: "soundhunters-5322e.firebaseapp.com",
  projectId: "soundhunters-5322e",
  storageBucket: "soundhunters-5322e.appspot.com",
  messagingSenderId: "806950335966",
  appId: "1:806950335966:web:10a5975d7ee364f9fd194f",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);
//const db = getFirestore(app);

export default { app,firebase};
