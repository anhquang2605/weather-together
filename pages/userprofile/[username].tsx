import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect } from 'react';
import { User } from "../../types/User";
import Link from "next/link";
import Summary from "../../components/profile/summary/Summary";
import ProfileBanner from "../../components/profile/profile-banner/ProfileBanner";
import Bio from "../../components/profile/bio/Bio";
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
            <div className="glass grow">
              <ProfileBanner user={user} isEditing={false} />
              <div className="flex flex-wrap lg:flex-nowrap">
              <div className="flex flex-col w-full xl:w-1/2 p-4">
                <Bio userBio={user.bio ?? ""}  isEditing={false} />
              </div>




              {/* Basic info */}
              <div className="w-full xl:w-1/2 p-4">
                <Summary isEditing={false} user={user}/>
                
              </div>
            </div>
              <Link className="action-btn block w-auto mx-auto " href={`/userprofile/edit/${user.username}`}>Edit Profile</Link>
            </div>
        </>
    )
}