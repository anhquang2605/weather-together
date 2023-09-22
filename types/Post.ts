export interface Post {
    _id?: string;
    content: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    pictureAttached: boolean;
    taggedUsernames: string[];
    visibility: string;
    weatherVibe?: WeatherVibe;
}
export interface WeatherVibe{
    caption?: string;
    weatherData: {
        condition: string;
        icon: string;
        temperature: number;
        location: string;
    }
}
//64c0070f04bf25a93c066cba 