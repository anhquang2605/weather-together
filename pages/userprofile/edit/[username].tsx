import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import {PiMagnifyingGlass} from "react-icons/pi";
import { User } from "../../../types/User";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../store/features/user/userSlice";
import { profile } from "console";
import { current } from "@reduxjs/toolkit";
import Summary from "../../../components/profile/summary/Summary";
import { tailwindStyles } from "../../../constants/tailwind-styles";
import {ImCloudUpload} from "react-icons/im";
import Modal from "../../../components/modal/Modal";
import Slider from "../../../components/slider/Slider";
import EditInformationForm from "../../../components/profile/edit/edit-information-form/EditInformationForm";
import ProfileBanner from "../../../components/profile/profile-banner/ProfileBanner";
import EditPictureForm from "../../../components/profile/edit/edit-picture-form/EditPictureForm";
import { useRouter } from "next/router";
import EditBackgroundForm from "../../../components/profile/edit/edit-background-form/EditBackgroundForm";
/* import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from './../../store/features/user/userSlice'; */
interface UserProfileProps {
    username: string;
    userJSON: any;
  }

export const getStaticProps: GetStaticProps = async ({ params }) =>  {
    const theuser = await getUserDataByUserName(params?.username as string);
    return {
      props: {
        userJSON: JSON.stringify(theuser),
      },
    };

   
  }

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getUsernamePaths()
    return {
      paths,
      fallback: false
    }
  }
export default function Edit({userJSON}:UserProfileProps){
  const [user, setUser] = useState<User>(JSON.parse(userJSON));
  const theTitle = `Profile for ${user.username}`;
  const route = useRouter();
  //form states
  const [bio, setBio] = useState<string | null>(user?.bio ?? null);
  //apid status
  const [apiStatus, setApiStatus] = useState('idle');
  const [profilePicturePath, setProfilePicturePath] = useState<string | null>(""); //['/images/
  //Editing states
  const [backgroundPicturePath, setBackgroundPicturePath] = useState<string | null>("");
  const [editingPicture, setEditingPicture] = useState<boolean>(false);
  const [editingInformation, setEditingInformation] = useState<boolean>(false);
  const [editingBackground, setEditingBackground] = useState<boolean>(false);
  const dispatch = useDispatch();

  const updateUserBio = async () => {
    if(user){
      setApiStatus('updating');
      const response = await fetch(`/api/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          bio: bio,
        }),
      });
      if(!response.ok){
        setApiStatus('update-error');
      } else {
        setApiStatus('update-success');
      }
    }
  }

  const handlePictureEditClose = () => {
    setEditingPicture(false);
  }

  const handleInformationEditClose = () => {
    setEditingInformation(false);
  }

  const handleBioChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  }
  const handleBackgroundEditClose = () => {
    setEditingBackground(false);
  }
  const handlePictureUpdated = (path:string) => {
    setProfilePicturePath(path);
  }
  const handleBackgroundUpdated = (path:string) => {
    setBackgroundPicturePath(path);
  }
  useEffect(() => {
    if(apiStatus === 'update-success' && bio && bio.length > 0){
      dispatch(updateUser({
        ...user,
        bio: bio,
      }));
    }
    route.push(window.location.pathname);
  }, [apiStatus,bio])
  useEffect(() => {
    if(profilePicturePath && profilePicturePath.length > 0){
        dispatch(updateUser({
        ...user,
        profilePicturePath: profilePicturePath,
        }));
    }
    route.push(window.location.pathname);
}, [profilePicturePath])
  useEffect(()=>{
    if(backgroundPicturePath && backgroundPicturePath.length > 0){
      dispatch(updateUser({
        ...user,
        backgroundPicturePath: backgroundPicturePath,
      }));
    }
    route.push(window.location.pathname);
  }, [backgroundPicturePath])
  useEffect(() => {
    if(userJSON)  setUser(JSON.parse(userJSON));
  }, [userJSON])

    return (
      <>
        <Head>
          <title>{theTitle}</title>
        </Head>
        <div className={"flex grow flex-wrap flex-col p-4 glass"}>
            {/* Profile Banner */}
            {/* Profile pic and background */}
            <ProfileBanner isEditing={true} user={user} setEditingBackground={setEditingBackground} setEditingPicture={setEditingPicture}/>

            <div className="flex flex-wrap lg:flex-nowrap">
              <div className="flex flex-col w-full xl:w-1/2 p-4">
                <h3 className="profile-section-title">Bio</h3>
                <input className="text-indigo-900 p-4 grow" onChange={handleBioChange} type="text-area" value={bio?.length ? bio : "Working on it!" }/>
                <button 
                  className="action-btn mt-4 mr-auto"
                  onClick={()=>{
                    updateUserBio();
                  }}
                >Update Bio</button>
              </div>




              {/* Basic info */}
              <div className="w-full xl:w-1/2 p-4">
                <Summary user={user}/>
                <button onClick={()=>setEditingInformation(true)} className="action-btn mt-4">Edit Information</button>
              </div>
            </div>
           
        </div>
        {/* Modal sections */}
      <Modal status={editingPicture} onClose={()=>{handlePictureEditClose()}}>
            <EditPictureForm onPictureUpdated={handlePictureUpdated} editing={editingPicture} user={user}/>
      </Modal>

      {/* Edit information Modal */}
      <Modal status={editingInformation} onClose={()=>{handleInformationEditClose()}}>
                  <EditInformationForm user={user}/>
      </Modal>
      {/* Background  */}
      <Modal status={editingBackground} onClose={()=>{handleBackgroundEditClose()}}>
                  <EditBackgroundForm user={user} onBackgroundUpdated={handleBackgroundUpdated} editing={editingBackground}/>
      </Modal>
    </>
    )
}
