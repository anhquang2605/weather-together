export interface Post {
    _id?: string;
    content: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    pictureAttached: boolean;
    taggedUsernames: string[];
    visibility: string;
    weatherVibe: {
        enabled: boolean;
        caption?: string;
        weatherData: {
            condition: string;
            temperature: number;
        }
    }
}
//64c0070f04bf25a93c066cba 