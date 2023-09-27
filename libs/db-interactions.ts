import { pick } from "lodash";
import { User, UserInClient } from "../types/User";

export async function getUserDataByUserName(username: string){
    try{
       const path = '/api/users?username=' + username;
       const options = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
       }
       const res = await fetch(path, options);
       if(res.status == 200){
           const data = await res.json();
           if(data.success){
                return data.data;
           }
       }
       return null;
    }catch(e){
        console.log(e);
        return null;
    }
}
export const pickUserInClient = (user: User) => {
    const pickedUser = pick(user, [
        'username',
        'location',
        'email',
        'featuredWeather',
        'firstName',
        'lastName',
        'profilePicturePath',
        'dateJoined',
        'backgroundPicturePath'
    ])
    return pickedUser as UserInClient;
}
