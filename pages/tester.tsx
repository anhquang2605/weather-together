import { useState } from "react"
import Post from './../components/activity/post/Post'
/* this page is for testing purposes only */
export default function Tester() {
    const post = {
        _id: "1",
        title: "This is a test post",
        content: "This is the content of the test post",
        dateCreated: new Date(),
        dateUpdated: new Date(),
        username: "testuser",
    }
    return (
        <>
            <h1>Tester</h1>
            <Post post={post} />

        </>
    )
}