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
    const [len, setLen] = useState(0);
    const [rate, setRate] = useState(0);
    const [delay, setDelay] = useState(0);
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
     const svg = document.getElementById(style['wave']);
      const text = document.getElementById('text');
      if(svg instanceof SVGPathElement ){
        const length = svg.getTotalLength();
        const textVelocity = length / 10;
        let timeTakesForTextToFullyAppear = 0;
        let textLengthOverPathLength = 0;
        let textLength = 1;
        if(text instanceof SVGTextElement){
            textLength = text.getComputedTextLength();
            timeTakesForTextToFullyAppear = textLength / textVelocity;
            textLengthOverPathLength = textLength / length;
        }
        setDelay(timeTakesForTextToFullyAppear);
        setRate(textLengthOverPathLength * 100);

        setLen(length * (1 - textLengthOverPathLength));
      }
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

                <svg id={style['in-place']}  width="1000" height="200" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
                    <path id={style["wave"]} fill="none" stroke="blue" strokeWidth="3" d="M0 100 Q 50 150 100 100 T 200 100 T 300 100 T 400 100 T 500 100 T 600 100 T 700 100 T 800 100 T 900 100 T 1000 100">

                <animateTransform 
            attributeName="transform"
            type="translate"
            from="0 0"
            to={`${len} 0`}
            dur="10s"
            repeatCount="indefinite"
        />
                    </path>
                     <text id="text" fontSize="24" fill="black">

                        {                   <textPath href={`#${style['wave']}`} startOffset={`${100 - rate}%`}>
                            <animate attributeName="startOffset" from={`${100 - rate}%`} to={0 + "%"} begin="0" dur="10s" repeatCount="indefinite" ></animate>
                            Riding the Wave!
                        </textPath>}
                    </text>
                </svg>
             
                </div>

{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}
        </div>

        </MockContext.Provider>
    )
}