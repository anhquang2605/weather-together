import React, { useState } from 'react';
import style from './post-engagement.module.css';
import {MdOutlineAddComment} from 'react-icons/md';
import Modal from '../../../modal/Modal';
import PostForm from '../post-form/PostForm';
interface PostEngagementProps {

}

const PostEngagement: React.FC<PostEngagementProps> = ({}) => {
    const [revealForm, setRevealForm] = useState(false)
    const handleOnCloseModal = () => {
        setRevealForm(false);
    }
    return (
        <>
        <div className={style['post-engagement'] + " glass-component p-8 w-full lg:w-[800px] mx-auto rounded-3xl"}>
              <h3 className="text-center text-3xl">
                Weather where you are, what's on your mind?  
              </h3>
              <button onClick={()=> {
                    setRevealForm(!revealForm)
              }} className={style['engagement-btn']}>
                    <MdOutlineAddComment className="w-8 h-8 mr-2"/> Air your thoughts
              </button> 

        </div>
            <Modal status={revealForm} containerClassName='form-container' onClose={handleOnCloseModal}>
                <PostForm
                />
            </Modal>
        </>
      
    );
};

export default PostEngagement;