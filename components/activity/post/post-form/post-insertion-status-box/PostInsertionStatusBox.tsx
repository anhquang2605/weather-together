import React from 'react';
import style from './post-insertion-status-box.module.css';
import LoadingIcon from '../../../../plugins/loading-icon/LoadingIcon';
import { IoSparkles, IoWarning } from 'react-icons/io5';

interface PostInsertionStatusBoxProps {
    apiStatusAndMessageMap: Map<string, string>;
    currentApiStatus: string;// idle, loading, success, error
    handleConfirm: () => void;
    setCurrentApiStatus: React.Dispatch<React.SetStateAction<string>>;
}
interface ApiStatusToIconMap {
    [key:string]: JSX.Element,
}
const apiStatusToIconMap:ApiStatusToIconMap = {
    "loading":   <LoadingIcon/>,
    "success": <IoSparkles className="icon"/> ,
    "error": <IoWarning className="icon"/>,
}
const PostInsertionStatusBox: React.FC<PostInsertionStatusBoxProps> = ({
    apiStatusAndMessageMap,
    currentApiStatus,
    handleConfirm,
    setCurrentApiStatus
}) => {
    const handleCancel = () => {
        setCurrentApiStatus("idle");
    }

    return (
        <div className={`${style['post-insertion-status-box']} ${style[currentApiStatus]}`}>
            <div className={`${style['status-icon']}`}>
                {apiStatusToIconMap[currentApiStatus]}
            </div>
            {apiStatusAndMessageMap.get(currentApiStatus)}
            {
                currentApiStatus === "success" &&
                <button className={`${style['confirm-btn']} action-btn`}>
                    <span onClick={()=>{
                        handleConfirm();
                    }}className="icon">Got It</span>
                </button>    
            }
            {
                currentApiStatus === "error" &&
                <button className={`${style['confirm-btn']} action-btn`}>
                    <span onClick={()=>{
                        handleCancel();
                    }}className="icon">Try Again</span>
                </button>
            }
        </div>
    );
};

export default PostInsertionStatusBox;