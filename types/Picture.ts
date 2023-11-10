export interface Picture{
    _id?: string;
    title?: string;
    picturePath: string; //url to the picture
    createdDate: Date;
    targetId?: string; // post or comment
    username: string; // user who posted or own the picture
    description?: string;
    ratio?: number;
    width?: number;
    height?: number;
    targetType?: string; // post or comment
    isDeleted?: boolean;
}