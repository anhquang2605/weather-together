import { createContext } from "react";
import { usernameToProfilePicturePathMap } from "./api/users";

type MockContextType = {
    profilePicturePaths : usernameToProfilePicturePathMap
}
export const MockContext = createContext<MockContextType>({
    profilePicturePaths : {
    }
});