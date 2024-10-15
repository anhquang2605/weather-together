import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect, useRef, useState } from 'react';
import { User } from "../../../types/User";
import { useDispatch } from "react-redux";
import Summary from "../../../components/profile/summary/Summary";
import Modal from "../../../components/modal/Modal";
import EditInformationForm from "../../../components/profile/edit/edit-information-form/EditInformationForm";
import ProfileBanner from "../../../components/profile/profile-banner/ProfileBanner";
import EditPictureForm from "../../../components/profile/edit/edit-picture-form/EditPictureForm";
import { useRouter } from "next/router";
import EditBackgroundForm from "../../../components/profile/edit/edit-background-form/EditBackgroundForm";
import EditBio from "../../../components/profile/edit/edit-bio/EditBio";
import Bio from "../../../components/profile/sections/bio/Bio";
import { useSession } from "next-auth/react";
import withAuthStatic from "../../authentication/with-auth-static";
import {subscribe, unSubcribe} from "../../../utils/websocket-service";
import style from './edit-profile.module.scss';
import SkyScroller from "../../../components/profile/sky-scroller/SkyScroller";
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
  const [dimension, setDimension] = useState(
    {width: 0, height: 0}
  );
  const dimensionRef = useRef(dimension)
  const route = useRouter();
  const [editingPicture, setEditingPicture] = useState<boolean>(false);
  const [editingInformation, setEditingInformation] = useState<boolean>(false);
  const [editingBackground, setEditingBackground] = useState<boolean>(false);
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  let resizeTimeout: NodeJS.Timeout | null = null;
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
  const getDimensionOfContainer = () => {
    const editProfilePage = document.querySelector(`.${style['edit-profile']}`);
    if(editProfilePage){
      return {
        width: editProfilePage.clientWidth,
        height: editProfilePage.clientHeight
      }
    }else{
      return {
        width: 0,
        height: 0
      }
    }
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
    //handleSettingDimensionWhenResize();
    if(user && user.username){
      subscribe( "user-changestream",user.username, handleUserChangeStreamMessage);
    }
    const resizeObserver = new ResizeObserver(entries => {
      if(resizeTimeout){
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        for(let entry of entries){
          //const {scrollHeight} = entry.target;
          const {width, height} = entry.contentRect;
          const profilePage = document.querySelector(`.${style['edit-profile']}`);
          if(profilePage){
            const padding = profilePage.clientWidth - width;
            const profileWidth = profilePage.clientWidth;
/*             setDimension({
              width,
              height
              //height: scrollHeight
            }); */
            setDimension({
              width: profileWidth,
              height: height + padding
            })
          }
         
          
        }
      },1000)
      
    })
    if(containerRef.current){
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      unSubcribe("user-changestream");
      if(containerRef.current){ 
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, []);
  useEffect(() =>
    {
      dimensionRef.current = dimension;
    },[dimension])
    useEffect(()=>{
      const theDimension = getDimensionOfContainer();
    
      setDimension(theDimension);
    },[])
    return (
      <>  
      {/* Need to fix the issue with scalling the height to match with the remaining estate 
        The problem is that children's height is way bigger than the parent supposed to be, and the parent's position is absolute
      */}
        <Head>
          <title>{theTitle}</title>
        </Head>
        <div className={`${style['edit-profile']}`}>
          <div className={`${style['edit-profile-wrapper']}`}>
          <SkyScroller parentClassName={style['edit-profile-wrapper']} layersNumber={2} cloudClassName={style[user.featuredWeather?.name || '']} skyClassName={style[user.featuredWeather?.name || '']} profileDimension={dimension} />
        <div className="w-full p-8 z-30">
                      {/* Profile Banner */}
            {/* Profile pic and background */}
            <ProfileBanner isEditing={true} user={user} setEditingBackground={setEditingBackground} setEditingPicture={setEditingPicture}/>

            <div className="flex flex-wrap lg:flex-nowrap mt-8">
             

            {/* The problem is that parent is to have fixed height, inner children also will have this same height, we need to set the height of inner children so it would extend the parent height */}

              {/* Basic info */}
              <div className="w-full mr-8">
                <Summary isEditing={true} setEditingSummary={setEditingInformation} user={user}/>
                
              </div>
              <div className="flex flex-col">
                <Bio key={user.bio} userBio={user.bio ?? ""} setEditingBio={setEditingBio} isEditing={true} />
              </div>

            </div>
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