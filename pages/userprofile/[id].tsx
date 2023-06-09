import Head from "next/head";
import {getUserIds,getUserData} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'

interface UserProfileProps {
    id: string;
    userJSON: any;
  }

export const getStaticProps: GetStaticProps = async ({ params }) =>  {
    const theuser = await getUserData(params?.id as string);
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
    const paths = await getUserIds()
    return {
      paths,
      fallback: false
    }
  }
export default function UserProfile({userJSON}:UserProfileProps){
  const user:any = JSON.parse(userJSON);
  const theTitle = `Profile for ${user.name}`;
    return (
        <>
            <Head>
                <title>{theTitle}</title>
            </Head>
            <h1>User Profile for {user.name} </h1>
        </>
    )
}