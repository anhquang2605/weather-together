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