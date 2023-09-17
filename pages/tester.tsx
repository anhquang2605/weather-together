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
import AnimatedBanner from "../components/profile/animated-banner/AnimatedBanner"
/* this page is for testing purposes only */
export default function Tester() {
    //const posts = generateRandomPosts(10);
    const [posts, setPosts] = useState([]);
    const [len, setLen] = useState(0);
    const [totalLen, setTotalLen] = useState(0);
    const [wordLen, setWordLen] = useState(0);
    const profilePicturePaths = {
        'anhquang2605': faker.image.avatar(),
        'chuquang2605': faker.image.avatar(),
    }


        useEffect(()=>{
  /*           let text = "About Me";
            let characters = text.split("").map(char => `<span>${char}</span>`).join("");
            if(document){
                const textContainer = document.getElementById(style["textContainer"]);
                const flag = document.getElementById(style["flag"]);
                if(textContainer)
                textContainer.innerHTML = characters;
                let delay = 0;
                const increment = 0.05; // delay increment in seconds
                let totalWidth = 0;
                document.querySelectorAll(`#${style['textContainer']} span`).forEach(span => {
                    const element = span as HTMLElement;
                    const width = element.getBoundingClientRect().width;
                    totalWidth += width;
                    element.style.animationDelay = `${delay}s`;
                    delay += increment;
                });
                if(flag){
                    let delay2 = 0;
                    const increment = 0.0025;
                    for(let i = 0; i < totalWidth; i++){
                        const element = document.createElement("div");
                        element.classList.add(style["bar"]);
                        element.style.animationDelay = `${delay2}s`;
                        delay2 += increment;
                        flag.appendChild(element);
                    }
                }
            } */
        getPostByUsernamesString('anhquang2605').then((posts) => {
                setPosts(posts)
        })
        },[])
/*     useEffect(() => {
     const svg = document.getElementById(style['wave']);
      const text = document.getElementById('text');
      if(svg instanceof SVGPathElement ){
        const length = svg.getTotalLength();
        setTotalLen(length);
        let textLengthOverPathLength = 0;
        let textLength = 1;
        if(text instanceof SVGTextElement){
            textLength = text.getComputedTextLength();
            console.log(textLength, totalLen)
            textLengthOverPathLength = textLength / length;
        }
        setWordLen(textLength);
        setLen((length - textLength));
       
      }
    }, []); */
    return (
        <MockContext.Provider value={{profilePicturePaths}}>
        <div className="w-full">
            <h1>Tester</h1>

     {/*   {
                 posts.map((post, index) => (
                    <Post key={index} post={post} username="anhquang2605" />
                )) 
            } */}


{/*                 <svg id={style['in-place']}  width="1000" height="200" viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
                    <path id={style["wave"]} fill="none" stroke="none
                    " strokeWidth="1" d="M0 125 Q 50 200 100 125 T 200 125 T 300 125 T 400 125 T 500 125 T 600 125 T 700 125 T 800 125 Q 850 200 900 125">

                <animateTransform 
            attributeName="transform"
            type="translate"
            from="0 0"
            to={`${len} 0`}
            repeatCount="indefinite"
            dur="5s"
            begin="0s"
            additive="sum"
        />
                    </path>
                     <text id="text" fontSize="32" fill="black">

                        {                   <textPath href={`#${style['wave']}`} >
                            <animate attributeName="startOffset" from={len} to={0} begin="0" dur="5s" repeatCount="indefinite" ></animate>
                            About Me
                        </textPath>}
                    </text>
                </svg> */}
             

                <AnimatedBanner text="About Me" flagClassName="flag" textClassName="text"/>
{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}
        </div>

        </MockContext.Provider>
    )
}