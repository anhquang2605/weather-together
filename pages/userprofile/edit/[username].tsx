import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { User } from "../../../types/User";
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
export default function Edit({userJSON}:UserProfileProps){
  const [apiStatus, setApiStatus] = useState('idle');
  const [droppedFile, setDroppedFile] = useState<Blob | null>(null);
  const [fileDropStatus, setFileDropStatus] = useState<string | null>(null);
  const user:User = JSON.parse(userJSON);
  const theTitle = `Profile for ${user.username}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    const file = droppedFile;
    if(file){
      const formData = new FormData();
      formData.append('file', file);
      setApiStatus('loading');
      const reponse =await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if(!reponse.ok){
        setApiStatus('error');
        return;
      }
      setApiStatus('success');
    }
  }

  const handleCancelDragOver = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.items;
    let theFile;
    if (files) {
      // Loop through all items in the DataTransferItemList object
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // If items are files, proceed as that
        if (file.kind === 'file') {
          theFile = file.getAsFile();
        }
      }
      if (theFile) {
        setDroppedFile(theFile);
      }
    } 
  }

  const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if(file){
      setDroppedFile(file);
    }
  }

    return (
      <>
        <Head>
          <title>{theTitle}</title>
        </Head>
        <div className="flex grow flex-wrap">
            <h1>Edi Profile for {user.username} </h1>
            <button>Upload profile picture from your device</button>
            {<div onDragOver={handleCancelDragOver} className="text-center grow height-2/3 mx-auto container border rounded justify-center items-center" onDrop={handleDrop}>
                { apiStatus === 'idle' &&
                  <>
                    <h3>{droppedFile ? `${droppedFile.name} ready to upload` :"Drag and drop a file here"} </h3>
                    <form onSubmit={handleSubmit}>
                      {!droppedFile && 
                      <input type="file" ref={fileInputRef} onChange={handleFileInputChange}/>}
                      
                      <button type="submit">Upload</button>
                      {droppedFile&&
                      
                      <p>Drag another file to replace or 
                        <button onClick={
                          (e) => {
                            e.preventDefault();
                            setDroppedFile(null);
                          }
                        }>Upload new</button>
                      </p>}
                    </form>
                  </>}
                { apiStatus === 'loading' && <h3>Uploading...</h3>}
                { apiStatus === 'success' && <h3>Upload successful</h3>}
                { apiStatus === 'error' && <h3>Upload failed <button onClick={()=>{setApiStatus('idle')}}>Try Again</button></h3>}
            </div>}

        </div>
      </>
    )
}