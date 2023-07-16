import { useState } from 'react'
import ImageAttachForm from './image-attach-form/ImageAttachForm';
import CustomSelect from '../../plugins/custom-select/CustomSelect';
import {MdPublic, MdPeople, MdLock} from 'react-icons/md'
import {IoImages, IoPricetags} from 'react-icons/io5'
import style from './post-form.module.css'
interface PostFormProps {
    username?: string;

}
export default function PostForm ({username}: PostFormProps) {
    const [content, setContent] = useState<string>("");
    const [pictureAttached, setPictureAttached] = useState<boolean>(false);
    const [taggedUsernames, setTaggedUsernames] = useState<string[]>([]);
    const [selectedVisibilityIndex, setSelectedVisibilityIndex] = useState<number>(0);
    const [revealImageAttachForm, setRevealImageAttachForm] = useState<boolean>(false);
    const handleContentChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }
    const handleImageAttach = () => {
        setPictureAttached(true);
    }
    const handleSubmission = () => {
        const post = {
            content,
            pictureAttached,
            taggedUsernames,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            visibility: visibilityOptions[selectedVisibilityIndex].value
        }

    }
/*     const visibilityOptions = [
        "public", 
        "friends", 
        "private"];
    const visibilityDescriptions = [
        "Anyone can see this post", 
        "Only friends can see this post", 
        "Only you can see this post"]; */
/*     const visibilityOptionsJSX = visibilityOptions.map((option,index) => {
        return ( 
        <option key={option} value={option}>
            {option + "-"  + visibilityDescriptions[index]}
        </option>
        )
    }) */
    const visibilityOptions = [
        {
            value: "public",
            description: "Anyone can see this post"
        },
        {
            value: "friends",
            description: "Only friends can see this post"
        },
        {
            value: "private",
            description: "Only you can see this post"
        }
    ]
    const visibilityIcons:any ={
        "public": <MdPublic className="icon" />,
        "friends": <MdPeople className="icon"  />,
        "private":  <MdLock className="icon"  /> ,
    }
    const optionTemplate = (title:string, description:string, selectedOption:boolean) => {
        return(
            <div key={title} data-value={title} className={"flex flex-row align-center"}>
                <span className="option-icon my-auto text-indigo-800">
                    {visibilityIcons[title]}
                </span>
                <span className="option-text ml-1.5 flex flex-col flex-wrap text-indigo-800">
                    <span className="option-title capitalize font-bold text-indigo-900">
                        {title}
                    </span>
                    {!selectedOption && <span className="option-description">
                        {description}
                    </span>}
                </span>
                <span className="drop-down-icon">

                </span>
            </div>
        )
    }
    return (
        <div className="post-form w-full">
            <h3 className="form-title mb-4">Post Creation</h3>
            
{/*                 <select value={visibility} onChange={handleVisibilityChange} className="text-indigo-900">
                    {visibilityOptionsJSX}
                </select> */}
                <CustomSelect outerClassName={'mb-4'}  selectedOptionClassName='option-selected' setSelected={setSelectedVisibilityIndex} optionTemplate={optionTemplate} options={visibilityOptions} selectedId={selectedVisibilityIndex} />
            
            <textarea 
                placeholder='Release your thought!' 
                name="post-content" 
                id="post-content" 
                value={content} 
                className="text-indigo-900 min-h-[150px] p-4 w-full mb-4"
                onChange={handleContentChange}
                ></textarea>
            {<ImageAttachForm revealState={revealImageAttachForm} setPictureAttached={setPictureAttached} setReveal={setRevealImageAttachForm}/>}
            <div className={`${style["attachment-group"]} mb-4`}>
                <span className={`${style.description}`}>
                    Attach to your posts:
                </span>
                <button className={`
                    ${style['attachment-btn']} 
                    ${style['image-btn']} 
                    ${pictureAttached ? style['attached'] : ''}
                    `} onClick={()=>{setRevealImageAttachForm(!revealImageAttachForm)}}>
                    <IoImages className="icon"/>
                    Images
                </button>
                <button className={`
                    ${style['attachment-btn']} 
                    ${style['tag-btn']}
                    ${taggedUsernames.length ? style['attached'] : ''}
                    `}>
                    <IoPricetags className="icon"/>
                    Friends Tags
                </button>
            </div>
            <div className="btn-group">
                <button className="action-btn w-full">Post</button>
            </div>  
        </div>
    )
}