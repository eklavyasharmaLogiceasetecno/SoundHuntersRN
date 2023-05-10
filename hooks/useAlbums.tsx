import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getFirestore,
  orderBy,
} from "firebase/firestore/lite";
import React, { createContext, useContext, useState, useEffect } from "react";
import { app } from "../config/firebaseconfig";
import useGeolocation from "./useGeolocation";
import firebase from "firebase/compat";

interface AlbumInputProps {
  children: React.ReactNode;
}
let libAlbumList: Album[] = [];

interface AlbumReturnProps {
  getAlbumList: () => Promise<Album[]>;
  getFilteredAlbumList: (title: string) => Promise<Album[]>;
  getUserAlbumList: (userid: string) => Promise<Album[]>;
  userLocation?: Coordinates;
  albumList?: Album[];
  saveAlbum: (userid: string, albumid: string) => Promise<string>;
  getAllSavedAlbums: (userid: string) => Promise<Album[]>;
  saveUserAlbum: (albumdetails: Album) => Promise<string>;
  checkIfAlbumIsSaved:(albumId: string) => Promise<boolean>;
}

export const AlbumContext = createContext<Partial<AlbumReturnProps>>({});

export const AlbumContextProvider = (
  props: AlbumInputProps
): React.ReactElement => {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [searchResult, setsearchResult] = useState<Album[]>([]);
  const database = getFirestore(app);
  const [userLocation] = useGeolocation();
  
  const getAlbumList = async (): Promise<Album[]> => {
    const q = query(collection(database, "albums"),orderBy('addedDate','desc'));

    const querySnapshot = await getDocs(q);

    let list: Album[] = [];
    querySnapshot.docs.map((doc) => {
      list.push(doc.data() as Album);

     
    });
    setAlbumList(list);

    return list;
  };

  const saveUserAlbum = async (albumdetails: Album): Promise<string> => {
    try {
      const docRef = await addDoc(collection(database, "albums"), {
        albumid: albumdetails.albumid,
        title: albumdetails.title,
        description: albumdetails.description,
        url: albumdetails.url,
        addedDate: albumdetails.addedDate,
        image: albumdetails.image,
        artistdetails: albumdetails.artistdetails,
        location: albumdetails.location,
        rate: albumdetails.rate,
        volume: albumdetails.volume,
      });
      console.log("SAVED Document written with ID: ", docRef.id);

      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error while Saving");
    }
  };

  const getFilteredAlbumList = async (title: string): Promise<Album[]> => {

    const albumRef = firebase.firestore().collection('albums');
   


    let filteredList: Album[] = [];
   
    const q = query(
      collection(database, "albums"),
      // where("title", "==", title)
      //@Dev title should contain more than 3 letters to search
      where("title", ">=", title),
      where("title", "<=", title+ '\uf8ff')
      
    );


    

    const querySnapshot = await getDocs(q);

    querySnapshot.docs.map((doc) => {
      filteredList.push(doc.data() as Album);
    });

    return filteredList;
  };

  const getUserAlbumList = async (userid: string): Promise<Album[]> => {
    let filteredList: Album[] = [];
    const q = query(
      collection(database, "albums"),
      where("artistdetails.userid", "==", userid) 
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.docs.map((doc) => {
      filteredList.push(doc.data() as Album);
    });
    
    
    return filteredList;
  };

  const saveAlbum = async (
    userid: string,
    albumid: string
  ): Promise<string> => {
    try {
      const docRef = await addDoc(collection(database, "savedglams"), {
        albumid: albumid,
        userid: userid,
      });
      console.log("Document written with ID: ", docRef.id);

      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error while Saving");
    }
  };

//@Neha check if album is saved
const checkIfAlbumIsSaved = async (albumId: string): Promise<boolean>=> {
  let list: Album[] = [];
  const q = query(
    collection(database, "savedglams"),
    where("albumid", "==", albumId)
  );
  const querySnapshot = await getDocs(q);
 
  return querySnapshot.docs.length>0?true:false
  }


  const getAllSavedAlbums = async (userid: string) : Promise<Album[]> => {
    let list: Album[] = [];
     console.log("userid saved ", userid);

    const q = query(
      collection(database, "savedglams"),
      where("userid", "==", userid)
    );

    let albumidList: any = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.docs.map((doc) => {
      albumidList.push(doc.data().albumid);
    });
   

    console.log("albumid saved ", albumidList);
    if (albumidList.length > 0) {
      const albumListQuery = query(
        collection(database, "albums"),
        where("albumid", "in", albumidList)
      );

      const savedQuerySnapshot = await getDocs(albumListQuery);

      savedQuerySnapshot.docs.map((doc) => {
       // savedAlbumList.push(doc.data() as Album);
      list.push(doc.data() as Album);

      });
      
    }

    return list;
  };

  const albumContext: AlbumReturnProps = {
    getAlbumList,
    getFilteredAlbumList,
    getUserAlbumList,
    userLocation: userLocation,
    albumList,
    saveAlbum,
    getAllSavedAlbums,
    saveUserAlbum,
    checkIfAlbumIsSaved,
  };

  return (
    <AlbumContext.Provider value={albumContext}>
      {props.children}
    </AlbumContext.Provider>
  );
};

export const { Consumer: AlbumContextConsumer } = AlbumContext;

export const useAlbums = (): Partial<AlbumReturnProps> =>
  useContext(AlbumContext);
