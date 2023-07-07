import Image from "next/image";
import { IoPencil } from "react-icons/io5";

interface BannerBackgroundProps {
    bannerPicturePath: string;
    isEditing: boolean;
    setEditingBackground?: (value: boolean) => void;
}
export default function BannerBackground({ bannerPicturePath, isEditing, setEditingBackground }: BannerBackgroundProps) {
    return (
        <div className="banner-background w-full absolute top-0 left-0 h-full z-1 flex flex-col p-4">

            <div className="w-full h-full absolute top-0 left-0">
                {bannerPicturePath?.length ? <Image fill alt="Banner background picture" className="w-full h-full absolute top-0" src={bannerPicturePath} /> : <div className="w-full h-full bg-slate-900"></div>}
            </div>
            {isEditing && setEditingBackground && 
             <>
                <IoPencil className="text-3xl text-slate-300 absolute top-4 right-4"/>
                <button className="transition-all w-full h-full font-semibold absolute text-transparent top-0 left-0 hover:hover-editable-image" onClick={()=>setEditingBackground(true)}>Update Background</button>

             </>
             }
        </div>
    )
}