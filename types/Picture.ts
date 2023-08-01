export interface Picture{
    _id?: string;
    title?: string;
    picturePath: string;
    createdDate: Date;
    targetId: string; // post or comment
    username: string; // user who posted or own the picture
    description?: string;
}