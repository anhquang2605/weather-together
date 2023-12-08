import {createContext} from 'react';

interface PostFormContextType{
    postId: string,
    editMode: boolean
}

const PostFormContext = createContext<PostFormContextType>({postId: '', editMode: false});

export default PostFormContext;