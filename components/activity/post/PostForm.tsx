import { useEffect, useState } from 'react'
import ImageAttachForm from './image-attach-form/ImageAttachForm';
import CustomSelect from '../../plugins/custom-select/CustomSelect';
import {MdPublic, MdPeople, MdLock} from 'react-icons/md'
import style from './post-form.module.css'
import AttachmentButtonGroup from './attachment-button-group/AttachmentButtonGroup';
interface PostFormProps {
    username?: string;

}
export default function PostForm ({username}: PostFormProps) {
    const [content, setContent] = useState<string>("");
    const [pictureAttached, setPictureAttached] = useState<boolean>(false);
    const [taggedUsernames, setTaggedUsernames] = useState<string[]>([]);
    const [selectedVisibilityIndex, setSelectedVisibilityIndex] = useState<number>(0);
    const [revealImageAttachForm, setRevealImageAttachForm] = useState<boolean>(false);
    const [attachedImages, setAttachedImages] = useState<Blob[]>([]);
    const handleContentChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }
    const handleImageAttach = () => {
        setPictureAttached(true);
    }
    const handleUploadImages = async (images:Blob[]) => {
        /* 
            1. wait for post to be created
            2. Upload images to cloudinary and get the urls
            3. Send the urls to the server
            4. Server will save the urls to the database and return the urls
            5. Client will receive the urls and save them to the post
        */
    }
    const handleUploadPost = async () => {

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
    useEffect(()=>{
        if(attachedImages.length > 0){
            console.log(attachedImages)
            setPictureAttached(true);
        }else{
            setPictureAttached(false);
        }
    },[attachedImages])
    return (
        <div className="post-form w-full">
            <h3 className="form-title mb-4">Post Creation</h3>
            
            <CustomSelect outerClassName={'mb-4'}  selectedOptionClassName='option-selected' setSelected={setSelectedVisibilityIndex} optionTemplate={optionTemplate} options={visibilityOptions} selectedId={selectedVisibilityIndex} />
            
            <textarea 
                placeholder='Release your thought!' 
                name="post-content" 
                id="post-content" 
                value={content} 
                className={"text-indigo-900 min-h-[150px] p-4 w-full mb-4 " + (revealImageAttachForm ? "max-h-60" : "max-h-80")}
                onChange={handleContentChange}
                ></textarea>
            {<ImageAttachForm 
                revealState={revealImageAttachForm} 
                setPictureAttached={setPictureAttached} 
                setReveal={setRevealImageAttachForm}
                setAttachedImages={setAttachedImages}
                />}

           <AttachmentButtonGroup 
                setRevealImageAttachForm={setRevealImageAttachForm} 
                attachedImagesLength={attachedImages.length}
                taggedUsernamesLength={taggedUsernames.length}
                />

            <div className="btn-group">
                <button className="action-btn w-full">Post</button>
            </div>  
        </div>
    )
}