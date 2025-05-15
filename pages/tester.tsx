import { useEffect, useState } from "react"
import { MockContext } from "./MockContext"
import { faker } from "@faker-js/faker"
import { getPostByUsernamesString } from "../libs/posts"
import SunCloud from "../components/activity/post/post-engagement/engagement-background/animation-components/default-bg-theme/sun-cloud/SunCloud"
import SnowCloud from "../components/activity/post/post-engagement/engagement-background/animation-components/default-bg-theme/snow-cloud/SnowCloud"
import PostEngagement from "../components/activity/post/post-engagement/PostEngagement"
import Loading from "../components/loading"
import LoadingIcon from "../components/plugins/loading-icon/LoadingIcon"
import { start } from "repl"
/* this page is for testing purposes only */
/* export const getStaticProps = async () => {
    const user = await getUserDataByUserName('anhquang2605');
    return {
        props: {
            userJSON: JSON.stringify(user),
        },
    };
} */
export default function Tester(userJSON:any) {
    //const user:User = JSON.parse(userJSON);
    //const posts = generateRandomPosts(10);
    const [posts, setPosts] = useState([]);
    const [startUpdate, setStartUpdate] = useState(false);
    const profilePicturePaths = {
        'anhquang2605': faker.image.avatar(),
        'chuquang2605': faker.image.avatar(),
    }
    const interval = 5000;
    const mockTimeEvent = (interval: number) => {
        const theinterval = setInterval(() => {
            setStartUpdate((prev) => !prev);
        }, interval);

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
            mockTimeEvent(interval);
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
    useEffect(() => {
        console.log("startUpdate", startUpdate);
    },[startUpdate])
    return (
        <MockContext.Provider value={{profilePicturePaths}}>
        <div className="w-full h-full overflow-y-scroll">
            <h1>Tester</h1>
            <Loading/>
        <div>

        </div>



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
             
{/* 
                <AnimatedBanner text="About Me" flagClassName="flag" textClassName="text"/> */}
{/*             <Modal status={true} containerClassName="form-container" >
                <PostForm />
            </Modal> */}
        </div>

        </MockContext.Provider>
    )
}