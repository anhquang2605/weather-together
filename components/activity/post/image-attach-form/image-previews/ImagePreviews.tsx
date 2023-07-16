import style from "./image-previews.module.css";
import {IoTrash} from "react-icons/io5";
import {RiImageAddFill} from "react-icons/ri";
import Image from "next/image";
interface ImagePreviewsProps {
    previewImageURLs: string[];
    setPreviewImageURLs: React.Dispatch<React.SetStateAction<string[]>>;
    removePreviewImage: (index:number) => void;
    imageInputRef: React.RefObject<HTMLInputElement>;
    handleFileInputChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveAllImagePreview: () => void;
}
export default function ImagePreviews({ previewImageURLs, setPreviewImageURLs, removePreviewImage,imageInputRef, handleRemoveAllImagePreview,handleFileInputChange }: ImagePreviewsProps) {
    return(
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
                                                onClick={()=>removePreviewImage(index)}
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
                    <input type="file" id="image-upload" className="hidden" ref={imageInputRef} onChange={handleFileInputChange}/>
                    <button onClick={handleRemoveAllImagePreview} className="critical-btn flex flex-row align-center shadow-lg text-sm">
                        <IoTrash className="w-5 h-5 mr-2"/>
                        Remove all
                    </button>
                </div>
        </>
    )
}