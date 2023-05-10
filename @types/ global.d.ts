declare interface UserProfile {
    email: string;
    primarylanguage: string;
    profilepicture: string;
    username: string;
    userid:string,
    documentid:string
    fullname:string,
    biodata:string,
    audioBg: string
}

declare interface AuthResponse {
    isSuccess: boolean;
    error: string;
    uid: string;
  
}

declare interface ArtistDetails {
    name: string;
    profilepicture: string;
    tagname: string;
    userid:string;
}


declare interface Album {
    title: string;
    description: string;
    url: string;
    addedDate: string;
    image?: string;
    artistdetails:ArtistDetails;
    location:Coordinates;
    albumid:string,
    rate?:number,
    volume:number,
}
interface Coordinates {
    latitude: number
    longitude: number
  }

  declare interface Recording {
    title: string;
    description: string;
    url: string;
    addedDate: string;
    image: string;
    artistdetails:ArtistDetails;
    location:Coordinates;
    rate:number;
    volume:number;
  }
  
  type MapPoint = JourneyAvailable | PlaceAvailable