import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { useEffect } from 'react';
import { User } from "../../types/User";
import Link from "next/link";
import Summary from "../../components/profile/summary/Summary";
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
            <img className="w-16 h-16 md:w-32 md:h-32 lg:w-48 lg:h-48 object-fit:cover " src={user.profilePicturePath}></img>
            <h1>User Profile for {user.username} </h1>
            <Summary/>
            <Link href={`/userprofile/edit/${user.username}`}>Edit</Link>
        </>
    )
}