import React, { useState } from 'react';
import style from './post-engagement.module.css';
import {MdOutlineAddComment} from 'react-icons/md';
import Modal from '../../../modal/Modal';
import PostForm from '../post-form/PostForm';
import { PostFormProvider } from './usePostFormContext';
import ViewSlider from '../../../plugins/view-slider/ViewSlider';
import BuddyTagForm from '../post-form/friend-tag-form/BuddyTagForm';
import { ViewSliderProvider } from '../../../plugins/view-slider/useViewSliderContext';
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
        <div className={style['post-engagement'] + " glass-component p-8 w-full lg:w-[800px] mx-auto rounded-3xl"}>
              <h3 className="text-center text-3xl">
                Weather outside or in, what's on your mind?
              </h3>
              <button onClick={()=> {
                    setRevealForm(!revealForm)
              }} className={style['engagement-btn']}>
                    <MdOutlineAddComment className="w-8 h-8 mr-2"/> Air your thoughts
              </button> 

        </div>
            <Modal status={revealForm} containerClassName='form-container' onClose={handleOnCloseModal}>
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
               
            </Modal>
        </>
      
    );
};

export default PostEngagement;