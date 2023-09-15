import { use, useEffect, useState } from "react"
import Post from './../components/activity/post/Post'
import PostForm from "../components/activity/post/post-form/PostForm"
import Modal from "../components/modal/Modal"
import { generateRandomPosts } from "../libs/fake-data-generators"
import { MockContext } from "./MockContext"
import { faker } from "@faker-js/faker"
import { fetchFromGetAPI } from "../libs/api-interactions"
import { getPostByUsernamesString } from "../libs/posts"
import style from './tester.module.css'
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
    useEffect(() => {
      
    }, []);
    return (
        <MockContext.Provider value={{profilePicturePaths}}>
        <div className="w-full">
        <h1>Tester</h1>
     {/*   {
                 posts.map((post, index) => (
                    <Post key={index} post={post} username="anhquang2605" />
                )) 
            } */}
            <div className="w-full flex flex-row">
            <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
    <path id="animatedWave" fill="none" stroke="blue" stroke-width="3">
        <animate attributeName="d" begin="0s" dur="4s" repeatCount="indefinite"
                 values="M0 125 Q 25 200 50 125 Q 75 50 100 125 Q 125 200 150 125 Q 175 50 200 125;
                         M0 125 Q 15 175 50 125 Q 75 75 100 125 Q 125 175 150 125 Q 175 75 200 125;
                         M0 125 Q 25 50 50 125 Q 75 200 100 125 Q 125 50 150 125 Q 175 200 200 125;
                         M0 125 Q 15 75 50 125 Q 75 175 100 125 Q 125 75 150 125 Q 175 175 200 125"
                 keyTimes="0;0.33;0.66;1"/>
    </path>
</svg>
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <path id="loopingWave2" fill="none" stroke="blue" stroke-width="3" d="M0 125 Q 50 200 100 125 Q 150 50 200 125"/>
    <path id="loopingWave" fill="none" stroke="blue" stroke-width="3" d="M0 125 Q 50 50 100 125 Q 150 200 200 125">
    <animate attributeName="d" begin="0s" dur="2s" repeatCount="indefinite"
                 values="M0 125 Q 50 50 100 125 Q 150 200 200 125;
                         M0 125 Q 50 200 100 125 Q 150 50 200 125;
                         M0 125 Q 50 50 100 125 Q 150 200 200 125;"
                 keyTimes="0;0.5;1"/>
    </path>
</svg>
                <svg id={style['in-place']} width="1000" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
                    <path id={style["wave"]} fill="none" stroke="blue" strokeWidth="3" d="M0 100 Q 50 150 100 100 T 200 100 T 300 100 T 400 100 T 500 100 T 600 100 T 700 100 T 800 100 T 900 100 T 1000 100">
                   
                    </path>
{/*                     <text fontSize="24" fill="black">
                        <textPath href={`#${style['wave']}`} startOffset="100%">
                            <animate attributeName="startOffset" from="100%" to="-15%" begin="0s" dur="10s" repeatCount="indefinite" fill="freeze"></animate>
                            Riding the Wave!
                        </textPath>
                    </text> */}
                </svg>
             \
                </div>

{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}
        </div>

        </MockContext.Provider>
    )
}