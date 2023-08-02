import { createContext } from "react";
import { usernameToProfilePicturePathMap } from "./api/user/post-user-profile-picture-paths";

type MockContextType = {
    profilePicturePaths : usernameToProfilePicturePathMap
}
export const MockContext = createContext<MockContextType>({
    profilePicturePaths : {
    }
});