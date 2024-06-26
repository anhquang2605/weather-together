import { Session } from "next-auth";
import { Location } from "./location";
import { Weather } from "./Weather";
import { ObjectId } from "mongodb";
export interface Information {
    firstName?: string,
    lastName?: string,
    email?: string,
    location: Location | null
}
export interface User{
    _id?: string,
    username: string,
    lastName: string,
    firstName: string,
    email?: string,
    password: string,
    location: Location | null,
    profilePicturePath?: string,
    bio?: string,
    backgroundPicturePath?: string,
    nickname?: string,
    favoriteWeathers?: Weather[],
    featuredWeather?: Weather,
    dateJoined: Date,
}

export interface UserInStore{
    _id?: string,
    username: string,
    location: Location | null,
    profilePicturePath?: string,
}
export interface UserInSession{
    username: string | null | undefined; 
    name?: string | null | undefined; 
    email?: string | null | undefined; 
    image?: string | null | undefined; 
    location?: Location | null | undefined;
    profilePicturePath: string | null | undefined;
    featuredWeather?: Weather,
    firstName: string,
    lastName: string,
    remember?: boolean,
}
export interface UserInClient{
    username: string,
    location: Location | null,
    profilePicturePath: string,
    featuredWeather?: Weather,
    dateJoined: Date,
    firstName: string,
    lastName: string,
    email: string;
    backgroundPicturePath: string;
    bio: string;
}
export interface UserInSearch{
    username: string,
    location: Location | null,
    profilePicturePath: string,
    featuredWeather?: Weather,
    dateJoined: Date,
    firstName: string,
    lastName: string,
    email: string;
    friendStatus: string;
    backgroundPicturePath: string;
}
export interface UserInFriendRequests{
    _id: string | ObjectId,
    username: string,
    targetUsername: string,
    createdDate: Date,
    updatedDate: Date,
    status: string,
    profilePicture: string,
    city: string,
    name: string,
    backgroundPicture: string,
    featuredWeather: Weather,
}

export interface Buddy{
    _id: string | ObjectId,
    username: string,
    friendUsername: string,
    since: Date,
    profilePicture: string,
    city: string,
    name: string,
    backgroundPicture: string,
    featuredWeather: Weather,
}
export interface UserBasic{
    username: string,
    profilePicturePath: string,
    name: string,
}

export interface UserWithFriendStatus extends UserBasic{
    friendStatus: string;
    city: string;
}