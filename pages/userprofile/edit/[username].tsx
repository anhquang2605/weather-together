import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { FormEvent, use, useEffect, useRef, useState } from 'react';
import { User } from "../../../types/User";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../store/features/user/userSlice";
import Summary from "../../../components/profile/summary/Summary";
import Modal from "../../../components/modal/Modal";
import EditInformationForm from "../../../components/profile/edit/edit-information-form/EditInformationForm";
import ProfileBanner from "../../../components/profile/profile-banner/ProfileBanner";
import EditPictureForm from "../../../components/profile/edit/edit-picture-form/EditPictureForm";
import { useRouter } from "next/router";
import EditBackgroundForm from "../../../components/profile/edit/edit-background-form/EditBackgroundForm";
import EditBio from "../../../components/profile/edit/edit-bio/EditBio";
import Bio from "../../../components/profile/bio/Bio";
import { Information } from "../../../types/User";
import { useSession } from "next-auth/react";
import withAuth from "../../authentication/with-auth";
import withAuthStatic from "../../authentication/with-auth-static";
import {send, subscribe, unSubcribe} from "../../../utils/websocket-service";
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
function Edit({userJSON}:UserProfileProps){
  const [user, setUser] = useState<User>(JSON.parse(userJSON));
  const {update} = useSession();
  const theTitle = `Profile for ${user.username}`;
  const route = useRouter();
  const [editingPicture, setEditingPicture] = useState<boolean>(false);
  const [editingInformation, setEditingInformation] = useState<boolean>(false);
  const [editingBackground, setEditingBackground] = useState<boolean>(false);
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const dispatch = useDispatch();
  const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
  const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
  
/*   const updateUserBio = async (bio:string) => {
    if(user){
      dispatch(updateUser({
        ...user,
        bio,
      }));
      //route.push(window.location.pathname);
    }
  } */

  const handlePictureEditClose = () => {
    setEditingPicture(false);
  }

  const handleInformationEditClose = () => {
    setEditingInformation(false);
  }


  const handleBackgroundEditClose = () => {
    setEditingBackground(false);
  }
  const handleUserChangeStreamMessage = (message:MessageEvent) => {
    const payload = JSON.parse(message.data);
    const updatedUser = {...user, ...payload.data};
    setUser(prevState => ({...prevState, ...payload.data}));
    update(updatedUser);
  }
/*   const handlePictureUpdated = (path:string) => {
    dispatch(updateUser({
      ...user,
      profilePicturePath: path,
      }));
    route.push(window.location.pathname);
  }
  const handleBackgroundUpdated = (path:string) => {
    dispatch(updateUser({
      ...user,
      backgroundPicturePath: path,
    }));
    route.push(window.location.pathname);
  }
  const handleInformationUpdated = (information: Information) => {
    dispatch(updateUser({
      ...user,
      ...information,
    }));
    route.push(window.location.pathname);
  }
   */
/*   useEffect(() => {
    if(apiStatus === 'update-success' && bio && bio.length > 0){
      
    }
    route.push(window.location.pathname);
  }, [apiStatus,bio]) */

  useEffect(() => {
    if(userJSON)  setUser(JSON.parse(userJSON));
  }, [userJSON])
  //WEB SOCKETS FOR MONGO DB
  useEffect(() => {
    if(user && user.username){
      subscribe( "user-changestream",user.username, handleUserChangeStreamMessage);
    }
    return () => {
      unSubcribe("user-changestream");
    }
  },[])
    return (
      <>
        <Head>
          <title>{theTitle}</title>
        </Head>
        <div className={"flex flex-wrap grow flex-col p-4 glass"}>
            {/* Profile Banner */}
            {/* Profile pic and background */}
            <ProfileBanner isEditing={true} user={user} setEditingBackground={setEditingBackground} setEditingPicture={setEditingPicture}/>

            <div className="flex flex-wrap lg:flex-nowrap">
              <div className="flex flex-col w-full xl:w-1/2 p-4">
                <Bio key={user.bio} userBio={user.bio ?? ""} setEditingBio={setEditingBio} isEditing={true} />
              </div>




              {/* Basic info */}
              <div className="w-full xl:w-1/2 p-4">
                <Summary isEditing={true} setEditingSummary={setEditingInformation} user={user}/>
                
              </div>
            </div>
           
        </div>
        {/* Modal sections */}
      <Modal status={editingPicture} onClose={()=>{handlePictureEditClose()}}>
            <EditPictureForm  editing={editingPicture} user={user}/>
      
      </Modal>

      {/* Edit information Modal */}
      <Modal status={editingInformation} onClose={()=>{handleInformationEditClose()}} containerClassName={"form-container"} title={"Contact Update"}>
              <EditInformationForm user={user}/>
      </Modal>
      {/* Background  */}
      <Modal status={editingBackground} onClose={()=>{handleBackgroundEditClose()}}>     
            <EditBackgroundForm user={user} editing={editingBackground}/>
      </Modal>
      <Modal status={editingBio} onClose={()=>{setEditingBio(false)}} containerClassName={"form-container"} title={"Bio Update"}>
            <EditBio key={user.bio} user={user} userBio={user.bio ?? ""} maxBioLength={200}/>
      </Modal>
    </>
    )
}

export default withAuthStatic(Edit);