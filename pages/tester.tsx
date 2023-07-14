import { useState } from "react"
import Post from './../components/activity/post/Post'
import PostForm from "../components/activity/post/PostForm"
import Modal from "../components/modal/Modal"
/* this page is for testing purposes only */
export default function Tester() {
    const post = {
        _id: "1",
        content: "This is the content of the test post",
        dateCreated: new Date(),
        dateUpdated: new Date(),
        username: "testuser",
        pictureAttached: false,
        taggedUsernames: [],
        visibility: "public"
    }
    return (
        <>
            <h1>Tester</h1>
            <Post post={post} />
            <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal>

        </>
    )
}