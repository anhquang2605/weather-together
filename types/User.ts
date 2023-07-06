import { Location } from "./Location";

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
    bannerPicturePath?: string,
}