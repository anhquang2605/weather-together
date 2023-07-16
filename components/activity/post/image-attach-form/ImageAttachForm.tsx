import { useEffect, useRef, useState } from "react";
import style from './image-attach-form.module.css'
import { ImCloudUpload } from "react-icons/im";
import {IoClose, IoTrash} from "react-icons/io5";
import {RiImageAddFill} from "react-icons/ri";
import Image from "next/image";
interface ImageAttachFormProps {
    username?: string;
    postId?: string;
    setReveal: React.Dispatch<React.SetStateAction<boolean>>;
    setPictureAttached: (value:boolean) => void;
    revealState?: boolean;
}
export default function ImageAttachForm({username, postId, setReveal, setPictureAttached, revealState}: ImageAttachFormProps) {
    const [droppedFile, setDroppedFile] = useState<Blob | null>(null);
    const [previewImageURLs, setPreviewImageURLs] = useState<string[]>([]);
    //Editing states
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setPreviewImageURLs([]);
        setDroppedFile(null);
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
            setDroppedFile(theFile);
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
            setDroppedFile(file);
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
            <>
                <div className={style['image-preview-container']}>
                    <div className={style['image-inner-container']}> 
                        {
                            previewImageURLs.map((url, index) => {
                                return (
                                    <div key={index} className={style['image-preview'] + " hover:glass-dark"}>
                                        <Image width={700} height={550} src={url} alt="preview" className="rounded object-contain"/>
                                        <div className={style['overlay-hover']}>
                                            <button 
                                                className={style['overlay-btn']}
                                                onClick={()=>handleRemoveImagePreview(index)}
                                            >
                                                    Remove
                                            </button>
                                            <button className={style["overlay-btn"]}>Edit</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={style["add-more-img-btn"] + " absolute top-8 mx-auto flex"}>
                    <label className="cursor-pointer action-btn flex flex-row align-center shadow-lg text-sm" htmlFor="image-upload">
                        <RiImageAddFill className="w-5 h-5 mr-2"/>
                        Add more picture
                    </label>
                    <input type="file" id="image-upload" className="hidden" ref={fileInputRef} onChange={handleFileInputChange}/>
                    <button onClick={handleRemoveAllImagePreview} className="critical-btn flex flex-row align-center shadow-lg text-sm">
                        <IoTrash className="w-5 h-5 mr-2"/>
                        Remove all
                    </button>
                </div>
            </>
            :
            <>                        
                <ImCloudUpload className="w-12 h-12 mx-auto"/>
                <h3 className="mb-4">Drag and drop your image in this box</h3>
                <h4 className="text">Or </h4>
                <label className="action-btn block cursor-pointer mt-4"htmlFor="image-upload">
                    Upload from device
                </label>
                <input type="file" id="image-upload" className="hidden" ref={fileInputRef} onChange={handleFileInputChange}/>
            </>
            }
        <button onClick={handleCloseForm} className="absolute top-0 right-0"><IoClose className="w-8 h-8"></IoClose></button>       
    </div>
    )
}