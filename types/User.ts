import { Session } from "next-auth";
import { Location } from "./location";
import { Weather } from "./Weather";
export interface Information {
    firstName?: string,
    lastName?: string,
    email?: string,
    location: Location | null
}
export interface User{
    _id?: string,
    username: string,
    lastName?: string,
    firstName?: string,
    email?: string,
    password: string,
    location: Location | null,
    profilePicturePath?: string,
    gallery?: string[],
    bio?: string,
    backgroundPicturePath?: string,
    nickname?: string,
    favoriteWeathers?: Weather[],
    featuredWeather?: Weather,
}

export interface UserInStore{
    _id?: string,
    username: string,
    location: Location | null,
    profilePicturePath?: string,
}
export interface UserInSession{
    username?: string | null | undefined; 
    name?: string | null | undefined; 
    email?: string | null | undefined; 
    image?: string | null | undefined; 
    location?: Location | null | undefined;
}