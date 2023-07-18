import {useRouter} from "next/router";
import style from './back-button.module.css'
import {IoReturnUpBack} from 'react-icons/io5'
export default function BackButton() {
    const router = useRouter();
    return (
        <button onClick={()=>{
            router.back();
        }} className={style["back-button"]}>   
            <IoReturnUpBack className="w-7 h-7 mr-1"/>
            <span>Back</span>
        </button>
    )
}