import { useState } from 'react'
import ImageAttachForm from './image-attach-form/ImageAttachForm';
interface PostFormProps {
    username?: string;

}
export default function PostForm ({username}: PostFormProps) {
    const [content, setContent] = useState<string>("");
    const [pictureAttached, setPictureAttached] = useState<boolean>(false);
    const [taggedUsernames, setTaggedUsernames] = useState<string[]>([]);
    const [visibility, setVisibility] = useState<string>("public");
    
    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVisibility(e.target.value);
    }
    const handleSubmission = () => {
        const post = {
            content,
            pictureAttached,
            taggedUsernames,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            visibility
        }

    }
    const visibilityOptions = [
        "public", 
        "friends", 
        "private"];
    const visibilityDescriptions = [
        "Anyone can see this post", 
        "Only friends can see this post", 
        "Only you can see this post"];
    const visibilityOptionsJSX = visibilityOptions.map((option,index) => {
        return ( 
        <option key={index} value={option}>
            <div className="option-box">
                <div className="option-title">{option}</div>
                <div className="option-description">{visibilityDescriptions[index]}</div>
            </div>
        </option>
        )
    })
    return (
        <div className="post-form w-full">
            <h3 className="text-2xl mb-4">Release the thought!</h3>
            <div className="visibility-group mb-2">
                <select value={visibility} onChange={handleVisibilityChange} className="text-indigo-900">
                    {visibilityOptionsJSX}
                </select>
            </div>
            <textarea name="post-content" id="post-content" value={content} className="text-indigo-900 p-4 w-full mb-4"></textarea>
            <ImageAttachForm />
            <div className="attachment-group mb-4">
                <button>Image</button>
                <button>Friend Tag</button>
            </div>
            <div className="btn-group">
                <button className="action-btn w-full">Post</button>
            </div>  
        </div>
    )
}