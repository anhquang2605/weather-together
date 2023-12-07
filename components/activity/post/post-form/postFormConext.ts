import {createContext} from 'react';

interface PostFormContextType{
    postId: string,
}

const PostFormContext = createContext<PostFormContextType>({postId: ''});

export default PostFormContext;