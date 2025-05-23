import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect, useRef, useState } from 'react';
import { User, UserInSearch } from "../../types/User";
import ProfileBanner from "../../components/profile/profile-banner/ProfileBanner";
import style from './user-profile.module.scss'
import SkyScroller from "../../components/profile/sky-scroller/SkyScroller";
import CityLandScape from "../../components/profile/city-landscape/CityLandscape";
import ProfileContent from "../../components/profile/profile-content/ProfileContent";
import { UserEditProfileContextProvider } from "../../context/useUserEditProfileContext";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiPassPendingLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { fetchFromGetAPI } from "../../libs/api-interactions";
import { get } from "lodash";
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
/* export const getStaticPaths : GetStaticPaths = async () => {
    const paths = getUserIds();
    return {
        paths,
        fallback: false,
    };
} */
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getUsernamePaths()
    return {
      paths,
      fallback: false
    }
  }


export default function UserProfile({userJSON}:UserProfileProps){
  const user:User = JSON.parse(userJSON);
  const {data:session} = useSession();
  const thisUser = session?.user;
  const theTitle = `Profile for ${user.username}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
 const [profileUser, setProfileUser] = useState<UserInSearch | User>(user);
 const [buddyStatus, setBuddyStatus] = useState<string>("");
 const [gettingBuddyStatus, setGettingBuddyStatus] = useState<boolean>(false);
  const [featuredWeather, setFeaturedWeather] = useState<string>(user.featuredWeather?.name || '');
  const [dimension, setDimension] = useState(
    {width: 0, height: 0}
  );
  const dimensionRef = useRef(dimension)
  let resizeTimeout: NodeJS.Timeout | null = null;
  const handleSettingDimensionWhenResize = () => {
    const profilePage = document.querySelector(`.${style['profile-page']}`);
    if(containerRef.current && profilePage){
/*       setDimension({
        width: containerRef.current.clientWidth,
        height: containerRef.current.scrollHeight
      }); */
      const padding = profilePage.clientWidth - profilePage.scrollWidth;
      setDimension({
        width: profilePage.clientWidth,
        height: containerRef.current.clientHeight + padding
      })
    }
  }
  const getInitialFriendStatus = () => {
    setGettingBuddyStatus(true);
    const path = 'friend-requests';
    const params = {
        username: thisUser?.username ?? '',
        targetUsername: profileUser.username,
        checkStatus: 'true'
    };
    const result = fetchFromGetAPI(path, params);
    result.then(res => {
        if(res.success){
            setBuddyStatus(res.data.status);
        }else{
            setBuddyStatus('stranger');
        }
        setGettingBuddyStatus(false);
    })
    
    
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
      const handleAddBuddy = async (e:React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setGettingBuddyStatus(true);
          setProfileUser({...profileUser, friendStatus: 'pending'});
          const sender = thisUser?.username;
          const receiver = profileUser.username;
          const options = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({sender, receiver})
          }
          try {
              const response =await fetch('/api/friend-requests', options);
              if(response.status !== 200){
                console.log(response.statusText);
              } 
              const data = await response.json();
              if(data.success){
                  setBuddyStatus('pending');
              }
              setGettingBuddyStatus(false);
          } catch (error) {
             setProfileUser({...profileUser, friendStatus: 'stranger'});
          } 
          }
  useEffect(() => {
    //check friend status if user is not profile user
    
    //handleSettingDimensionWhenResize();
    const resizeObserver = new ResizeObserver(entries => {
      if(resizeTimeout){
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        for(let entry of entries){
          //const {scrollHeight} = entry.target;
          const {width, height} = entry.contentRect;
          const profilePage = document.querySelector(`.${style['profile-page']}`);
          if(profilePage){
            const padding = profilePage.clientWidth - width;
            const profileWidth = profilePage.clientWidth;
/*             setDimension({
              width,
              height
              //height: scrollHeight
            });  */
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
      if(containerRef.current){ 
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, []);
  useEffect(() => {
    if(thisUser && thisUser?.username !== profileUser.username){
      getInitialFriendStatus();
    }
  },[thisUser])
  useEffect(() =>
  {
    dimensionRef.current = dimension;
  },[dimension])

    return (
        <>
            <Head>
                <title>{theTitle}</title>
            </Head>
            <UserEditProfileContextProvider value={
          {featuredWeather, setFeaturedWeather}
        }>
            <div ref={profileRef} className={`${style['profile-page']}  ${style[featuredWeather]}`}>
              <div ref={containerRef}  className={style["top-layer"]}>
                <div className={style['profile-banner-wrapper']}>
                  <ProfileBanner user={user} isEditing={false} handleAddBuddy={handleAddBuddy} buddyStatus={buddyStatus} gettingBuddyStatus={gettingBuddyStatus}/>
                </div>
                <ProfileContent user={user} scrollContainerClassname={style['profile-page']} />
                 <CityLandScape />
              </div>

              <SkyScroller parentClassName={style['profile-page']} layersNumber={2} cloudClassName={style[ 'cloud']} skyClassName={style[featuredWeather]} profileDimension={dimension} />
             
            </div>
            </UserEditProfileContextProvider>
        </>
    )
}
