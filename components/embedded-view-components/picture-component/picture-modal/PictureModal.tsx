import React, { useEffect } from 'react';
import style from './picture-modal.module.css';
import Image from 'next/image';
import { usePictureModal} from '../PictureModalContext';
import { IoClose } from 'react-icons/io5';
import PictureInteractionPanel from '../picture-interaction-panel/PictureInteractionPanel';
import { getUserDataByUserName, pickUserInClient } from '../../../../libs/db-interactions';
import { UserInClient } from '../../../../types/User';
import {IoArrowBack, IoArrowForward} from 'react-icons/io5';

const PictureModal: React.FC = () => {
    const {content, show, setShow, showNext, showPrevious, isSlider} = usePictureModal();
    const [isVertical, setIsVertical] = React.useState(false);
    const [user, setUser] = React.useState<UserInClient | null>(null);// [username, firstName, lastName, profilePicturePath
    
    const getUser = async (author: string) => {
        const data = await getUserDataByUserName(author);
        if(data){
            const user = await pickUserInClient(data);
            setUser(user);
        }
    }
    useEffect(() => {
        if(content){
            setIsVertical(content?.width! < content?.height!);
            getUser(content.username);
        }
    }, [content]);
    return (
        content && show && <div className={style['picture-modal']}>
            {content && <div className={style['modal-content']}>
                <button className={style['close-btn']}>
                    <IoClose onClick={()=>{
                        setShow(false);
                    }}/>
                </button>
                <div className={style['picture-container']}>
                    {isSlider && <div className={style['picture-slider-btns']}>
                        <button onClick={showPrevious}>
                            <IoArrowBack/>
                        </button>
                        <button onClick={showNext}>
                            <IoArrowForward/>
                        </button>
                    </div>
}
                    <Image className={`${style['picture-content']} ${isVertical ? style['vertical-image'] : ""}`} src={content.picturePath} alt={`Attached picture of ${content.username}`} width={content.width} height={content.height} />
                </div>
                {user && <PictureInteractionPanel picture={content} author={user}/>}

            </div>}
            <div className={`glass-dark ${style['modal-background']}`}>
            </div>
            
        </div>
    );
};

export default PictureModal;