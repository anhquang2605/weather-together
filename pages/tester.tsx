import { useState } from "react"
import Post from './../components/activity/post/Post'
import PostForm from "../components/activity/post/post-form/PostForm"
import Modal from "../components/modal/Modal"
import { generateRandomPosts } from "../libs/fake-data-generators"
/* this page is for testing purposes only */
export default function Tester() {
    const post = generateRandomPosts(1)[0];
    return (
        <div className="glass w-full">
            <h1>Tester</h1>
            <Post post={post} />
{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}

        </div>
    )
}