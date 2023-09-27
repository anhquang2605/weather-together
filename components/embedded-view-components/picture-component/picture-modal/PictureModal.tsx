import React, { useEffect } from 'react';
import style from './picture-modal.module.css';
import Image from 'next/image';
import {usePictureModal} from '../PictureModalContext';
import { IoClose } from 'react-icons/io5';
import PictureInteractionPanel from '../picture-interaction-panel/PictureInteractionPanel';
import { getUserDataByUserName, pickUserInClient } from '../../../../libs/users';
import { UserInClient } from '../../../../types/User';

const PictureModal: React.FC = () => {
    const {content, show, setShow} = usePictureModal();
    const [isVertical, setIsVertical] = React.useState(false);
    const [user, setUser] = React.useState<UserInClient | null>(null);// [username, firstName, lastName, profilePicturePath
    if(!show) return null;
    const {src, alt, width, height, _id, author} = content!;// content is null when the modal is closed
    const getUser = async () => {
        const data = await getUserDataByUserName(author);
        if(data){
            const user = await pickUserInClient(data);
            setUser(user);
        }
    }
    useEffect(()=>{
        setIsVertical(height > width);
    });
    return (
        <div className={style['picture-modal']}>
            <div className={style['modal-content']}>
                <button className={style['close-btn']}>
                    <IoClose onClick={()=>{
                        setShow(false);
                    }}/>
                </button>
                <div className={style['picture-container']}>
                    <Image className={`${style['picture-content']} ${isVertical ? style['vertical-image'] : ""}`} src={src} alt={alt} width={width} height={height} />
                </div>
                {user && <PictureInteractionPanel pictureId={typeof _id === 'object' ? _id.toString() : _id} author={user}/>}

            </div>
            <div className={`glass-dark ${style['modal-background']}`}>
            </div>
            
        </div>
    );
};

export default PictureModal;