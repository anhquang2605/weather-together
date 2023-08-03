import { fetchFromGetAPI } from "./api-interactions";

export const getPostByUsernamesString = async (usernames: string) => {
    const path = 'post/get-posts'
    const params = {
        authorsString: usernames
    }
    const posts = await fetchFromGetAPI(path,params);
    return posts
}