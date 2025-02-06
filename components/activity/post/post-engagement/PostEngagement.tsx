import React, { useState } from 'react';
import style from './post-engagement.module.css';
import {MdOutlineAddComment} from 'react-icons/md';
import { FaShare } from "react-icons/fa6";
import Modal from '../../../modal/Modal';
import PostForm from '../post-form/PostForm';
import { PostFormProvider } from './usePostFormContext';
import BuddyTagForm from '../post-form/friend-tag-form/BuddyTagForm';
import { ViewSliderProvider } from '../../../plugins/view-slider/useViewSliderContext';
import { PostFormContextProvider } from '../post-form/postFormContext';
import EngagementBackground from './engagement-background/EngagementBackground';
interface PostEngagementProps {
    username: string;
}

const PostEngagement: React.FC<PostEngagementProps> = ({username}) => {
    const [revealForm, setRevealForm] = useState(false)
    const handleOnCloseModal = () => {
        setRevealForm(false);
    }
    return (
        <>
        <div className={style['post-engagement'] + " p-8 w-full relative overflow-hidden feed-page-main-components mx-auto rounded-3xl"}>
            <EngagementBackground />
              <h3 className={style["engagement-title"]}>
                Weather outside or in, what's on your mind?
              </h3>
              <button onClick={()=> {
                    setRevealForm(!revealForm)
              }} className={style['engagement-btn']}>
                <div className={style['engagement-btn-bg-container']}>
                    <div className={style['engagement-btn-background']}></div>
                </div>
                    
                    <span className="flex relative"><FaShare className="w-5 h-5 sm:w-7 sm:h-7 mr-2 font-semibold"/> <span className={style['engagement-btn-text']}>Air your thoughts</span></span>           
              </button> 

        </div>
            <Modal status={revealForm} containerClassName='form-container' onClose={handleOnCloseModal}>
                <PostFormContextProvider>
                    <PostFormProvider>
                        <ViewSliderProvider
                            childSlidesContent={
                                [
                                    <PostForm
                                    setRevealModal={setRevealForm}
                                    username={username}
                                    />,
                                    <BuddyTagForm
                                        username={username}
                                    />
                                ]
                            }
                        />
                    </PostFormProvider>
                </PostFormContextProvider>
            </Modal>
        </>
      
    );
};

export default PostEngagement;