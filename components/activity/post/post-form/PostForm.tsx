import { useEffect, useState } from 'react'
import ImageAttachForm from './image-attach-form/ImageAttachForm';
import CustomSelect from '../../../plugins/custom-select/CustomSelect';
import {MdPublic, MdPeople, MdLock} from 'react-icons/md'
import style from './post-form.module.css'
import AttachmentButtonGroup from './attachment-button-group/AttachmentButtonGroup';
import { usePostFormContext } from '../post-engagement/usePostFormContext';
import { set } from 'lodash';
import { Picture } from '../../../../types/Picture';
import { Post, WeatherVibe } from '../../../../types/Post';
import PostInsertionStatusBox from './post-insertion-status-box/PostInsertionStatusBox';
import { getImageDimensions } from '../../../../libs/pictures';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { current } from '@reduxjs/toolkit';
interface PostFormProps {
    username: string;
    setRevealModal: React.Dispatch<React.SetStateAction<boolean>>;
    post?: Post;
    revealed?: boolean;
}
export default function PostForm ({username, setRevealModal, post, revealed}: PostFormProps) {
    const [uploadingStatus, setUploadingStatus] = useState<string>("idle"); // idle, loading, success, error
    const [content, setContent] = useState<string>("");
    const [pictureAttached, setPictureAttached] = useState<boolean>(false);
    const taggedUsernames:string[] = usePostFormContext().getTaggedUsernames();
    const [selectedVisibilityIndex, setSelectedVisibilityIndex] = useState<number>(0);
    const [revealImageAttachForm, setRevealImageAttachForm] = useState<boolean>(false);
    const [attachedImages, setAttachedImages] = useState<Blob[]>([]);
    const [originalAttachedImagePaths, setOriginalAttachedImagePaths] = useState<String[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentWeather, setCurrentWeather] = useState<any>(null);
    const {reset} = usePostFormContext();

    const apiStatusAndMessageMap = new Map<string, string>(
        [
            ["idle", ""],
            ["loading", "Uploading..."],
            ["success", "Post uploaded successfully!"],
            ["error", "Error uploading post!"]
        ]
    );
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
    const handleContentChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }
    const handleUploadPictures = async (editing?:boolean) => {
        const formData = new FormData();
        attachedImages.forEach((image) => {
            formData.append('files', image);
        });

        const res = await fetch('/api/upload-images', { 
            method: 'POST',
            body: formData
        })
        if(res.status === 200){
            const data = await res.json();
            return data;
        }else{
            return null;
        }
    }
    const handleInsertPostToDb = async (post:Post) => {
        const path = '/api/post/add-post';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        }
        try{
            const res = await fetch(path, options);
            if(res.status === 200){
                return res.json();
            }else{
                return null;
            }
        }catch(err){
            console.log(err);
            return null;
        }
    }
    const generatePictureObjects = async (imageURLs:string[], username: string, targetId:string, targetType: string) => {
        const dimensionsPromises = attachedImages.map(async (image) => {
            const dim = await getImageDimensions(image);
            return dim;
        });
        const picturesDimensions = await Promise.all(dimensionsPromises);
        const pictures:Picture[] = [];
        imageURLs.forEach((imageURL, index) => {
            const picture:Picture = {
                picturePath: imageURL,
                username,
                targetId,
                targetType,
                createdDate: new Date(),
                width: picturesDimensions[index].width,
                height: picturesDimensions[index].height,
            }
            pictures.push(picture);
        })
        return pictures;
    }
    const handleInsertPicturesToDb = async (pictures:Picture[]) => {
        const path = '/api/pictures';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pictures)
        }
        try{
            const res = await fetch(path, options);
            if(res.status === 200){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
            return false;
        }
    }
    
    const handleUploadPost = async () => {
        setUploadingStatus("loading");
        let uploadedImagesURLs:string[] = [];
        if(attachedImages.length > 0){

            let response  = await handleUploadPictures();
            if(response){  
                uploadedImagesURLs = response.urls;
            }
        }

        const post:Post = {
            content,
            taggedUsernames,
            createdDate: new Date(),
            updatedDate: new Date(),
            visibility: visibilityOptions[selectedVisibilityIndex].value,
            pictureAttached,
            username,
        }
        if(currentWeather){
            post.weatherVibe = {
                    condition: currentWeather.condition || "",
                    icon: currentWeather.icon || "",
                    temperature: currentWeather.temp,
                    location: currentWeather.location || "",
            }
        }        
        const res = await handleInsertPostToDb(post); 
        if(res && pictureAttached ){
            const pictures:Picture[] = await generatePictureObjects(uploadedImagesURLs, username, res.insertedId, "post");
            const pictureUploadRes = await handleInsertPicturesToDb(pictures);
            if(pictureUploadRes){
                resetForm();
                setUploadingStatus("success");
            }else{
                setUploadingStatus("error");
            }
        }else if(res){
            resetForm();
            setUploadingStatus("success");}
        else{
            setUploadingStatus("error");
        }
        
    }

    const handleGettingPicturesForEditPost = async (postId: string) => {
        const params = {
            targetId: postId,
            many: "true"
        }
        const path = 'pictures/targetId/picture-path';
        const result = await fetchFromGetAPI(path, params);
        if(result.success){
            const imagePath = result.data as string[];
            setOriginalAttachedImagePaths(imagePath);
            const imageBlobs = await Promise.all(imagePath.map(async (path:string) => {
                //get blob from url
                const res = await fetch(path);
                const blob = await res.blob();
                return blob;
            }))
            setAttachedImages(imageBlobs);
        }
    }
    const handleFillFormForEditPost = (post: Post) => {
        setContent(post.content);
        setSelectedVisibilityIndex(visibilityOptions.findIndex((option) => option.value === post.visibility));
        if(post.pictureAttached){
            handleGettingPicturesForEditPost(post._id as string);
        }
        post.weatherVibe && setCurrentWeather(post.weatherVibe);
    }
    const optionTemplate = (title:string, description:string, selectedOption:boolean) => {
        return(
            <div key={title} data-value={title} className={"flex flex-row align-center w-full"}>
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
    const resetForm = () => {
        setContent("");
        setPictureAttached(false);
        setAttachedImages([]);
        setCurrentWeather(null);
        setSelectedVisibilityIndex(0);
        setUploadingStatus("idle");
        reset();
    }
    const handlePostSentConfirmation = () => {
        setUploadingStatus("idle");
        setRevealModal(false);
    }

    useEffect(()=>{
        if(attachedImages.length > 0){
            setPictureAttached(true);
        }else{
            setPictureAttached(false);
        }
    },[attachedImages])
    useEffect(()=>{
        if(revealed && post){
            handleFillFormForEditPost(post);
            setIsEditing(true);
        }
    },[revealed])
    return (
        <div className="post-form w-full relative">
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
                attachedImages={attachedImages}
                />}

           <AttachmentButtonGroup 
                setRevealImageAttachForm={setRevealImageAttachForm} 
                attachedImagesLength={attachedImages.length}
                taggedUsernamesLength={taggedUsernames.length}
                taggedUsernames={taggedUsernames}
                setCurrentWeather={setCurrentWeather}
                currentWeather={currentWeather}
                />

            <div className="btn-group">
                <button onClick={()=>{
                    handleUploadPost();
                }} className="action-btn w-full">{isEditing ? "Finish Edit" : "Post"}</button>
            </div>
{ uploadingStatus !== 'idle' &&            <PostInsertionStatusBox
                apiStatusAndMessageMap={apiStatusAndMessageMap}
                currentApiStatus={uploadingStatus}
                handleConfirm={handlePostSentConfirmation}
                setCurrentApiStatus={setUploadingStatus}
            />}
        </div>
    )
}


