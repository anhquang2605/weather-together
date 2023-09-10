import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect } from 'react';
import { User } from "../../types/User";
import Summary from "../../components/profile/summary/Summary";
import ProfileBanner from "../../components/profile/profile-banner/ProfileBanner";
import Bio from "../../components/profile/bio/Bio";
import { useSession } from "next-auth/react";
import style from './user-profile.module.scss'
import SkyScroller from "../../components/profile/sky-scroller/SkyScroller";
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
  const theTitle = `Profile for ${user.username}`;
    return (
        <>
            <Head>
                <title>{theTitle}</title>
            </Head>
            <div className={`${style['profile-page']} ${style[user.featuredWeather?.name || '']}`}>
              <ProfileBanner user={user} isEditing={false} />
              <SkyScroller layersNumber={3} />
            </div>
        </>
    )
}