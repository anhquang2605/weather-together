import { useEffect, useRef, useState } from "react";
import style from './image-attach-form.module.css'
import { ImCloudUpload } from "react-icons/im";
import {IoClose} from "react-icons/io5";
import ImagePreviews from "./image-previews/ImagePreviews";
import { set } from "lodash";
import { usePostFormContext } from "../../post-engagement/usePostFormContext";
interface ImageAttachFormProps {
    setReveal: React.Dispatch<React.SetStateAction<boolean>>;
    setPictureAttached: (value:boolean) => void;
    revealState?: boolean;
    setAttachedImages: (value:Blob[]) => void;
    editPreviewImageURLs?: string[];
    setRemovedAttachedImages?: React.Dispatch<React.SetStateAction<string[]>>;
    previewImageURLs: string[];
    setPreviewImageURLs: React.Dispatch<React.SetStateAction<string[]>>;
    URLtoBlobMap: Map<string, Blob>;
    setURLtoBlobMap: React.Dispatch<React.SetStateAction<Map<string, Blob>>>;
}

export default function ImageAttachForm({setReveal, setPictureAttached, revealState, setAttachedImages, editPreviewImageURLs, setRemovedAttachedImages, previewImageURLs, setPreviewImageURLs, setURLtoBlobMap}: ImageAttachFormProps) {
    const {getUniquePostId} = usePostFormContext();
    const [uniqueId, setUniqueId] = useState(""); 
    const [droppedImages, setDroppedImages] = useState<Blob[] >([]);
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
                handleSettingImageFiles(theFile);
            }
        } 
    }

    const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if(file){
            handleSettingImageFiles(file);
        }
    }
    const handleSettingImageFiles = async (theFile: Blob) => {
        setDroppedImages(prevState => [...prevState, theFile as Blob]);
        const theURL = await URL.createObjectURL(theFile as Blob);
        setURLtoBlobMap(prevState => {
            const newState = new Map(prevState);
            newState.set(theURL, theFile as Blob);
            return newState;
        })
        setPreviewImageURLs(prevState => 
                [
                    ...prevState,
                theURL
                ]
        );        
    }
    const handleRemoveImagePreview = (index:number) => {
        setPreviewImageURLs(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        })
        setRemovedAttachedImages && setRemovedAttachedImages(prevState => {
            const newState = [...prevState];
            newState.push(editPreviewImageURLs![index]);
            return newState;
        })
        setDroppedImages(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        })
    }
    const handleSetImageUrlsFromAttachedImages = (imagesURLs: string[]) => {
        const imagesURLsLen = imagesURLs.length;
        setPreviewImageURLs(prev => {
            const prevLen = prev.length;
            if(imagesURLsLen > prevLen){
                return imagesURLs;
            }else{
                const newState = [...prev];
                newState.splice(imagesURLsLen, prevLen - imagesURLsLen);
                return newState;
            }
        });
        setDroppedImages(prev => {
            //convert each image urls to blob then set to droppedImages
            if(imagesURLsLen > 0){
                const newState = [...prev];
                for(let i = 0; i < imagesURLsLen; i++){
                    const blob = new Blob([imagesURLs[i]]);
                    const file = new File([blob], "image.png", {type: "image/png"});
                    newState[i] = file;
                    console.log(file);
                }
                return newState;
            }else{
                return [];
            }
        })
    }
    const handleRemoveAllImagePreview = () => {
        setRemovedAttachedImages && setRemovedAttachedImages(prevState => {
            const newState = [...prevState];
            newState.push(...editPreviewImageURLs!);
            return newState;
        })
        setPreviewImageURLs([]);
        setDroppedImages([]);
        //for edit case, make sure to remove all images attached to the post
    }
    useEffect(()=>{
        setUniqueId(getUniquePostId(""));
    },[])
    useEffect(()=>{
        setAttachedImages(droppedImages);
    },[droppedImages])
    useEffect(()=>{
        if(editPreviewImageURLs && editPreviewImageURLs.length > 0){
            handleSetImageUrlsFromAttachedImages(editPreviewImageURLs);
        }
    },[editPreviewImageURLs])
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
                <label className="action-btn block cursor-pointer mt-4 mb-8"htmlFor={"image-upload-" + uniqueId}>
                    Upload from device
                </label>
                <input type="file" id={"image-upload-"+uniqueId} className="hidden" ref={fileInputRef} onChange={handleFileInputChange}/>
            </>
            }
        <button onClick={handleCloseForm} className="absolute top-0 right-0"><IoClose className="w-8 h-8"></IoClose></button>       
    </div>
    )
}