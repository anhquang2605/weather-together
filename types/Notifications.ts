export interface Notification {
    _id?: string;
    title: string;
    username: string; // who will receive the notification is prepared during the trigger of the notification
    sender_username: string; // who is sending the notification
    type: string; // type of notification
    createdDate: Date;
    read: boolean;
    reference_id?: string; // id of the object that will be used to redirect the user to the page of the object
    subject_id: string; // id of the object that is triggering the notification such comment, reactions, friend_requests etc..
}
//comment (with username1) to a post of (username2)
//check if the post associate with the comment is owned by the creator of the added entry which triggers the notification
//if yes, then the notification is not created
//if no, then the notification is created, with the user_id of the owner of the post