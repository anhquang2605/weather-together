import { useEffect, useRef, useState } from "react";
import style from './image-attach-form.module.css'
import { ImCloudUpload } from "react-icons/im";
import {IoClose, IoTrash} from "react-icons/io5";
import {RiImageAddFill} from "react-icons/ri";
import Image from "next/image";
import ImagePreviews from "./image-previews/ImagePreviews";
interface ImageAttachFormProps {
    username?: string;
    postId?: string;
    setReveal: React.Dispatch<React.SetStateAction<boolean>>;
    setPictureAttached: (value:boolean) => void;
    revealState?: boolean;
}
export default function ImageAttachForm({username, postId, setReveal, setPictureAttached, revealState}: ImageAttachFormProps) {
    const [droppedImages, setDroppedImages] = useState<Blob[] >([]);
    const [previewImageURLs, setPreviewImageURLs] = useState<string[]>([]);
    //Editing states
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setPreviewImageURLs([]);
        setDroppedImages([]);
    }

    const handleCloseForm = () => {
        setReveal(false);
    }

    const handleCancelDragOver = (e:React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const handleDrop = (e:React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.items;
        let theFile: File | null = null;
        if (files) {
            // Loop through all items in the DataTransferItemList object
            for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // If items are files, proceed as that
            if (file.kind === 'file') {
                theFile = file.getAsFile();
            }
            }
            if (theFile) {
            setDroppedImages(prevState => [...prevState, theFile as Blob]);
            setPreviewImageURLs(prevState => 
                    [
                        ...prevState,
                    URL.createObjectURL(theFile as Blob)
                    ]
                );
            }
        } 
    }

    const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if(file){
            setDroppedImages(prevState => [...prevState, file as Blob]);
            setPreviewImageURLs(prevState => 
                [
                    ...prevState,
                URL.createObjectURL(file as Blob)
                ]
            );
        }
    }
    const handleRemoveImagePreview = (index:number) => {
        setPreviewImageURLs(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        })
    }
    const handleRemoveAllImagePreview = () => {
        setPreviewImageURLs([]);
    }
    const handleUploadImages = (images:Blob[]) => {
        /* 
            1. wait for post to be created
            2. Upload images to cloudinary and get the urls
            3. Send the urls to the server
            4. Server will save the urls to the database and return the urls
            5. Client will receive the urls and save them to the post
        */
    }
    useEffect(() => {
        if(previewImageURLs.length > 0){
            setPictureAttached(true);
        } else {
            setPictureAttached(false);
        }
    },[previewImageURLs])
    return (
    <div 
        onDragOver={handleCancelDragOver}

        className={
            style["image-attach-form"] + 
            " p-4 border border-slate-400 relative mb-4" +
            " " + (revealState ? "" : style["not-reveal"])} 
        onDrop={handleDrop}
    >         
            {previewImageURLs.length ?
                <ImagePreviews
                    previewImageURLs={previewImageURLs}
                    setPreviewImageURLs={setPreviewImageURLs}
                    removePreviewImage={handleRemoveImagePreview}
                    imageInputRef={fileInputRef}
                    handleFileInputChange={handleFileInputChange}
                    handleRemoveAllImagePreview={handleRemoveAllImagePreview}
                />
            :
            <>                        
                <ImCloudUpload className="w-12 h-12 mx-auto mt-8"/>
                <h3 className="mb-4">Drag and drop your image in this box</h3>
                <h4 className="text">Or </h4>
                <label className="action-btn block cursor-pointer mt-4 mb-8"htmlFor="image-upload">
                    Upload from device
                </label>
                <input type="file" id="image-upload" className="hidden" ref={fileInputRef} onChange={handleFileInputChange}/>
            </>
            }
        <button onClick={handleCloseForm} className="absolute top-0 right-0"><IoClose className="w-8 h-8"></IoClose></button>       
    </div>
    )
}