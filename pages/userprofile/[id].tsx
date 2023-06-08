import Head from "next/head";
import {getUserIds} from "../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'

interface UserProfileProps {
    id: string;
  }

export const getStaticProps: GetStaticProps = async ({ params }) =>  {
    //const userData = await getUserData(params.id);
    return {
      props: {
        id : params?.id ?? 0,
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
export default function UserProfile({id}:UserProfileProps){
    return (
        <>
            <Head>
                <title>User Profile</title>
            </Head>
            <h1>User Profile for {id} </h1>
        </>
    )
}