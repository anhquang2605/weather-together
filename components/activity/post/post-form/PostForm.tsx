import { use, useEffect, useRef, useState } from 'react'
import ImageAttachForm from './image-attach-form/ImageAttachForm';
import CustomSelect from '../../../plugins/custom-select/CustomSelect';
import {MdPublic, MdPeople, MdLock} from 'react-icons/md'
import AttachmentButtonGroup from './attachment-button-group/AttachmentButtonGroup';
import { usePostFormContext } from '../post-engagement/usePostFormContext';
import { Picture } from '../../../../types/Picture';
import { Post} from '../../../../types/Post';
import PostInsertionStatusBox from './post-insertion-status-box/PostInsertionStatusBox';
import { getImageDimensions } from '../../../../libs/pictures';
import { fetchFromGetAPI } from '../../../../libs/api-interactions';
import { BuddyTag } from './friend-tag-form/BuddyTagForm';
import { usePostFormContext2 }  from './postFormContext';
import { set } from 'lodash';
interface PostFormProps {
    username: string;
    setRevealModal: React.Dispatch<React.SetStateAction<boolean>>;
    post?: Post;
    revealed?: boolean;
    setPost?: React.Dispatch<React.SetStateAction<Post>>;
}
export default function PostForm ({username, setRevealModal, post, revealed, setPost}: PostFormProps) {
    const [uploadingStatus, setUploadingStatus] = useState<string>("idle"); // idle, loading, success, error
    const [content, setContent] = useState<string>("");
    const [pictureAttached, setPictureAttached] = useState<boolean>(false);
    const taggedUsernames:string[] = usePostFormContext().getTaggedUsernames();
    const [selectedVisibilityIndex, setSelectedVisibilityIndex] = useState<number>(0);
    const [revealImageAttachForm, setRevealImageAttachForm] = useState<boolean>(false);
    const [attachedImages, setAttachedImages] = useState<Blob[]>([]);
    const [previewImageURLs,setPreviewImageURLs] = useState<string[]>([]); // [blob url
    const [originalAttachedImagePaths, setOriginalAttachedImagePaths] = useState<String[]>([]);
    const [URLtoBlobMap, setURLtoBlobMap] = useState<Map<string, Blob>>(new Map<string, Blob>()); // [blob url, blob
    const [isEditing, setIsEditing] = useState(false);
    const [currentWeather, setCurrentWeather] = useState<any>(null);
    const {reset} = usePostFormContext();
    const addTaggedBuddies = usePostFormContext().addTaggedBuddies;
    const [imageURLtoS3URLMap, setImageURLtoS3URLMap] = useState<Map<string, string>>(new Map<string, string>()); // [imageURL, s3URL
    const [editPreviewImageURLs, setEditPreviewImageURLs] = useState<string[]>([]);
    const [removedAttachedImages, setRemovedAttachedImages] = useState<string[]>([]);
    const {setEditMode, setPostId} = usePostFormContext2();
    const apiStatusAndMessageMap = new Map<string, string>(
        [
            ["idle", ""],
            ["loading", "Uploading..."],
            ["success", "Post " + (isEditing? "updated" : "uploaded")  + " successfully!"],
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
    const handleDeletePicturesFromS3 = async (s3ImagePaths:string[]) => {
/*         const test = ['https://weather-together-image-bucket.s3.us-east-2.amazonaws.com/galaxy.png', 'https://weather-together-image-bucket.s3.us-east-2.amazonaws.com/google_bug.PNG'] */
        const path = '/api/s3/delete-urls';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: s3ImagePaths
            })
/*             body: JSON.stringify({
                urls: test
            }) */
        }
        try{
            const res = await fetch(path, options);
            if(res.status === 200){
                const result = await res.json();
                if(result.success){
                    return true;
                }
            }
            return false;
        }catch(err){
            console.log(err);
            return false;
        }
    }
    const handleDeletePicturesFromDb = async (picturePaths:string[]) => {
        const path = '/api/pictures/delete-pictures';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(picturePaths)
        }
        try{
            const res = await fetch(path, options);
            if(res.status !== 200){
                return false;
            }
            const result = await res.json();
            if(result.success){
                return true;
            }else{
                result.error && console.log(result.error);
                return false;
            }
        }catch(err){
            console.log(err);
            return false;
        }
    }
    const handleUploadPictures = async (editing?:boolean) => {
        // from the preview urls, get the blob, then upload to s3
        // if editing, only upload new pictures
        let toBeUpload:Blob[] = [];
        for(let i = 0; i < previewImageURLs.length; i++){
            const url = previewImageURLs[i];
            const blob = URLtoBlobMap.get(url);
            const thisBlobRemoved = removedAttachedImages.includes(url);
            const s3URL = imageURLtoS3URLMap.get(url);
            if(blob && !thisBlobRemoved && !s3URL){
                toBeUpload.push(blob);
            }
        }
        if(toBeUpload.length > 0){
            const formData = new FormData();
            toBeUpload.forEach((image) => {
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
        } else {
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
    const handleUpdatePostToDb = async (post:Post) => {
        const path = '/api/post/update-post';
        const options = {
            method: 'PUT',
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
    
    const handleUploadPost = async () => {
        //need to distinguish when edit or upload the new post
        setUploadingStatus("loading");
        let uploadedImagesURLs:string[] = [];
        //if editing, check in the removed images, remove them from s3
        if(isEditing){
            const matchedRemovedURLS = [];
            for(let i = 0; i < removedAttachedImages.length; i++){
               //check if the url is in the map, then remove from s3
                const url = removedAttachedImages[i];
                const s3URL = imageURLtoS3URLMap.get(url);
                if(s3URL){
                    matchedRemovedURLS.push(s3URL);
                }
            };
           if(matchedRemovedURLS.length > 0){
            const deleteRes = await handleDeletePicturesFromS3(matchedRemovedURLS);
            const deleteDbRes = await handleDeletePicturesFromDb(matchedRemovedURLS);
            if(!deleteRes || !deleteDbRes){
                setUploadingStatus("error");
                return;
            }
          }
        }
        if(attachedImages.length > 0){
            
            //check if there are any new images, upload them to s3
            let response  = await handleUploadPictures(isEditing);
            if(response){  
                uploadedImagesURLs = response.urls;
            } 
        }
        const postData:Post = {
            content,
            taggedUsernames,
            createdDate: isEditing ? post?.createdDate as Date : new Date(),
            updatedDate: new Date(),
            visibility: visibilityOptions[selectedVisibilityIndex].value,
            pictureAttached,
            username,
        }
       
        if(currentWeather){
            postData.weatherVibe = {
                    condition: currentWeather.condition || "",
                    icon: currentWeather.icon || "",
                    temperature: currentWeather.temp,
                    location: currentWeather.location || "",
            }
        }
        let res = null;
        if(isEditing){
            postData._id = post?._id || "";
            res = await handleUpdatePostToDb(postData);
        } else {
            res = await handleInsertPostToDb(postData); 
        }       
        if(res && pictureAttached && uploadedImagesURLs.length > 0 ){
            if(pictureAttached && uploadedImagesURLs.length > 0){
                const pictures:Picture[] = await generatePictureObjects(uploadedImagesURLs, username, res.insertedId, "post");
                const pictureUploadRes = await handleInsertPicturesToDb(pictures);
                if(!pictureUploadRes){
                    setUploadingStatus("error");
                    return;
                }
            }
            
            resetForm();
            setUploadingStatus("success");
            if(setPost){
                setPost(postData)
            }
                
            
        }else {
            setUploadingStatus("error");
        }
/*         let results = generatePictureObjects(previewImageURLs, username, "", "post");
        console.log(results); */
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
                const url = URL.createObjectURL(blob);
                setURLtoBlobMap(prevState => {
                    const newState = new Map(prevState);
                    newState.set(url, blob);
                    return newState;
                })
                setImageURLtoS3URLMap(prevState => {
                    const newState = new Map(prevState);
                    newState.set(url, path);
                    return newState;
                })
                setEditPreviewImageURLs(prevState => [...prevState, url]);
                return blob;
            }))
            setAttachedImages(imageBlobs);
        }
    }
    const handleFillFormForEditPost = async (post: Post) => {
        setContent(post.content);
        setSelectedVisibilityIndex(visibilityOptions.findIndex((option) => option.value === post.visibility));
        if(post.pictureAttached){
            handleGettingPicturesForEditPost(post._id as string);
        }
        if(post.taggedUsernames && post.taggedUsernames.length > 0){
            const res = await handleFetchBuddiesFromUsernames(post.taggedUsernames);
            if(res.success){
                const buddies:BuddyTag[] = res.data;
                buddies.forEach((buddy) => {
                    buddy.tagged = true;
                })
                addTaggedBuddies(buddies);
            }
        }
    }
    const handleFetchBuddiesFromUsernames = async (usernames:string[]) => {
        const path = '/api/buddies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usernames)
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
        setPreviewImageURLs([]);
        setEditPreviewImageURLs([]);
        setOriginalAttachedImagePaths([]);
        setRemovedAttachedImages([]);
        setURLtoBlobMap(new Map<string, Blob>());
        setImageURLtoS3URLMap(new Map<string, string>());
        setRevealImageAttachForm(false);
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
        if(revealed && post && post?._id !== ""){
            setPostId(post._id as string);
            handleFillFormForEditPost(post);
            setIsEditing(true);
        }else if(!revealed){
            resetForm();
            setIsEditing(false);
        }
    },[revealed])
    useEffect(()=>{
        if(isEditing){
            setRevealImageAttachForm(true);
        }
        setEditMode(isEditing);
    },[isEditing])
    return (
        <div className="post-form w-full relative">
            <h3 className="form-title mb-4">{isEditing ? "Change your mind?" : "Post Creation"}</h3>        
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
                editPreviewImageURLs={editPreviewImageURLs}
                setRemovedAttachedImages={setRemovedAttachedImages}
                previewImageURLs={previewImageURLs}
                setPreviewImageURLs={setPreviewImageURLs}
                URLtoBlobMap={URLtoBlobMap}
                setURLtoBlobMap={setURLtoBlobMap}
                />}

           <AttachmentButtonGroup 
                setRevealImageAttachForm={setRevealImageAttachForm} 
                attachedImagesLength={attachedImages.length}
                taggedUsernamesLength={taggedUsernames.length}
                taggedUsernames={taggedUsernames}
                setCurrentWeather={setCurrentWeather}
                currentWeather={currentWeather}
                isEditing={isEditing}
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


