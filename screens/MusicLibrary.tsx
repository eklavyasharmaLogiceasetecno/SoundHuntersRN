import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
 
} from "react-native";
import { useAlbums } from "../hooks/useAlbums";
import { getHeight, getWidth } from "../libs/styleHelper";
import { useTheme } from "../theme";
import TextView from "../components/TextView";
import fontFamilies from "../theme/fontfamilies";
import Library from "../components/Library";
import { LIBRARY, NOAUDIOPOST, SOUNDSAVE } from "../strings/en";
import { fontSize } from "../theme/fontSize";
import { useUser } from "../hooks/useUser";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../components/Loader";

export default function MusicLibrary(): React.ReactElement {
  const { colors } = useTheme();
  const [albumList, setAlbumList] = useState<Album[] | undefined>([]);
  const { getUserAlbumList, getAllSavedAlbums } = useAlbums();
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useUser();

  // useEffect(() => {
  //   setAlbumList([])
  //   fetchData();
  //   setIsLoading(true);
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true)
      setAlbumList([])
      fetchData();
     
    }, [])
  );

  async function fetchData() {
    let albumListDataList: Album[] =[]
    const data = await getUserAlbumList?.(
      userProfile ? userProfile.userid : ""
    );

    const savedAlbum = await getAllSavedAlbums?.(
      userProfile ? userProfile.userid : ""
    );

      //a) How to concat two list and merge into one
        const list = data?.concat(...savedAlbum)
      // remove duplicate from a list
   

       
      list.forEach(obj => {
        if (!albumListDataList.some(o => o.albumid === obj.albumid)) {
          albumListDataList.push({...obj});
        }
      });
  



    setAlbumList(albumListDataList)
    
  //       console.log('Saved',JSON.stringify(savedAlbum))
    setIsLoading(false);
// if(data?.length===0 && savedAlbum?.length>0)
// {
//   setAlbumList(savedAlbum);
// }
// else if(data?.length>0 && savedAlbum?.length===0) {
// setAlbumList(data)
// }
// else if(data?.length>0 && savedAlbum?.length>0)
// {
//   albumData = data
//   for(let i =0;i<data?.length; i++)
//   {
//     for(let j=0; savedAlbum?.length<0; j++)
//     {
//       if(data[i].albumid!==savedAlbum[j].albumid)
//       albumData.push(savedAlbum)
//     }
//   }
}

    
    
  
   
  
  const numColumns = 2;
  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): React.ReactElement => <Library item={item} />;
  return (
    <View
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <StatusBar backgroundColor="rgba(1.0, 0, 0, 0.2)" translucent />
      <View
        style={{ ...styles.headingView,
          borderBottomColor: colors.cardbackground,
        }}
      >
        <TextView text={LIBRARY} style={styles.heading} color={colors.primarytextcolor}/>
        <TextView text={SOUNDSAVE} style={styles.subheading} color={colors.primarytextcolor}/>
      </View>
      <View style={{ flex: 1 }}>
        {/* {isLoading && <Loader />} */}
        {albumList && albumList.length > 0 ? (
          <FlatList
            data={albumList}
            numColumns={numColumns}
            renderItem={renderItem}
            keyExtractor={(item, index) => "key" + index}
            keyboardShouldPersistTaps="always"
          />
        ) : (
          <View style={{height:getHeight(300),justifyContent:'flex-end'}}>
            {!isLoading && (
              <TextView text={"No Audio Post in Library!"} style={styles.description} />
            )}
          </View>
        )}
      </View>
      
       {isLoading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Loader />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getHeight(20),
    padding: getHeight(12),
  },
  heading: {
    fontSize: fontSize.maximum,
    fontFamily: fontFamilies.moderat,
    fontWeight:'700',
    paddingTop: getHeight(10),
    paddingLeft: getWidth(20),
    marginBottom:getHeight(10)
  },
  subheading: {
    fontSize: fontSize.heading,
    fontFamily: fontFamilies.moderatLight,
    fontWeight: "bold",
    paddingLeft: getWidth(20),
    paddingBottom: getHeight(10),
    marginTop:getHeight(10)
    
  },
  headingView:{
    paddingTop:getHeight(20),
  },
  description: {
    fontFamily: fontFamilies.nunito,
    fontWeight: "400",
    width: "100%",
    textAlign: "center",
    fontSize: 15,
  },
});
