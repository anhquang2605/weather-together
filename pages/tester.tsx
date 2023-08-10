import { use, useEffect, useState } from "react"
import Post from './../components/activity/post/Post'
import PostForm from "../components/activity/post/post-form/PostForm"
import Modal from "../components/modal/Modal"
import { generateRandomPosts } from "../libs/fake-data-generators"
import { MockContext } from "./MockContext"
import { faker } from "@faker-js/faker"
import { fetchFromGetAPI } from "../libs/api-interactions"
import { getPostByUsernamesString } from "../libs/posts"
/* this page is for testing purposes only */
export default function Tester() {
    //const posts = generateRandomPosts(10);
    const [posts, setPosts] = useState([]);
    const profilePicturePaths = {
        'anhquang2605': faker.image.avatar(),
        'chuquang2605': faker.image.avatar(),
    }

    useEffect(()=>{
       getPostByUsernamesString('anhquang2605').then((posts) => {
            setPosts(posts)
       })
    },[])
    return (
        <MockContext.Provider value={{profilePicturePaths}}>
        <div className="w-full">
        <h1>Tester</h1>
       {
                posts.map((post, index) => (
                    <Post key={index} post={post} username="anhquang2605" />
                ))
            }
            
{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}
        </div>

        </MockContext.Provider>
    )
}