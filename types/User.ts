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
}
export interface UserInFriendRequests{
    _id: string | ObjectId,
    username: string,
    targetUsername: string,
    createdDate: Date,
    updatedDate: Date,
    status: string,
    associatedProfilePicture: string,
    associatedFirstName: string,
    associatedLastName: string,
    associatedLocation: Location,
    associatedFeaturedWeather: Weather | null,
    associatedBackgroundPicture: string,
}