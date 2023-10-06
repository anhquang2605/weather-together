import React from 'react';
import style from './post-modal.module.css';
import { IoClose } from 'react-icons/io5';

interface PostModalProps {
    children: React.ReactNode;
    title: string;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;

}

const PostModal: React.FC<PostModalProps> = (props) => {
    const {children, title, show, setShow, onClose} = props;
    return (
        <div className={style['post-modal'] + " " + (!show && style['hidden-modal'])}>

            <div className={style['post-modal__content'] + " glass" }>
                {title.length > 0 && <h3 className={style['post-modal__title']}>
                    {title}
                </h3>}
                <button onClick={onClose} className={style
                ["modal-close-btn"] + " drop-shadow-lg"}><IoClose
                ></IoClose></button>
                {
                    children
                }
            </div>
            <div onClick={()=>{
                onClose();
            }} className="bg-slate-800/70 backdrop-blur-lg w-full h-full absolute z-10">
            </div>
        </div>
    );
};

export default PostModal;