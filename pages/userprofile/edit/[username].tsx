import Head from "next/head";
import { getUserDataByUserName, getUsernamePaths} from "../../../libs/users";
import { GetStaticProps, GetStaticPaths } from 'next'
import { FormEvent, useEffect, useRef, useState } from 'react';
import { User } from "../../../types/User";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../store/features/user/userSlice";
import { profile } from "console";
import { current } from "@reduxjs/toolkit";
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
  const [profilePicturePath, setProfilePicturePath] = useState<string | null>(""); //['/images/profile-pictures/default.png'
  const [droppedFile, setDroppedFile] = useState<Blob | null>(null);
  const [fileDropStatus, setFileDropStatus] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  //image croping states
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null); 
  const [initialScrollLeft, setInitialScrollLeft] = useState<number | null>(null); 
  const [initialScrollTop, setInitialScrollTop] = useState<number | null>(null); 
  const [initalPageX, setInitialPageX] = useState<number | null>(null); 
  const [initalPageY, setInitialPageY] = useState<number | null>(null); //['/images/profile-pictures/default.png'
  const [isDown, setIsDown] = useState<boolean>(false); //['/images/profile-pictures/default.png'
  const user:User = JSON.parse(userJSON);
  const theTitle = `Profile for ${user.username}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    const file = droppedFile;
    if(file){
      const  fileType = file['type'];
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!validImageTypes.includes(fileType)) {
        setApiStatus('invalid');
        return;
      }
      const filename = file.name;
      const extension = filename.split('.').pop();
      //get cropped image from canvas
      const canvas = document.getElementById('image-canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      const img = document.querySelector('img') as HTMLImageElement;
      const container = document.querySelector('.crop-conainer') as HTMLDivElement;
      //Stats of container
      let imgRect = img.getBoundingClientRect();
      let containerRect = container.getBoundingClientRect();
    
      // Image's natural width and height
      let imgNaturalWidth = img.naturalWidth;
      let imgNaturalHeight = img.naturalHeight;

      // Image's displayed width and height in the container
      let imgDisplayedWidth = imgRect.width;
      let imgDisplayedHeight = imgRect.height;

      // The ratio between the natural size and the displayed size
      let widthRatio = imgNaturalWidth / imgDisplayedWidth;
      let heightRatio = imgNaturalHeight / imgDisplayedHeight;

      // Calculate the coordinates of the visible area in the image
      let startX = Math.max(0, (containerRect.left - imgRect.left) * widthRatio);
      let startY = Math.max(0, (containerRect.top - imgRect.top) * heightRatio);
      let endX = startX + (containerRect.width * widthRatio);
      let endY = startY + (containerRect.height * heightRatio);

      // Adjust canvas size
      canvas.width = endX - startX;
      canvas.height = endY - startY;

      // Draw the visible part of the image on the canvas
      ctx?.drawImage(img, startX, startY, endX - startX, endY - startY, 0, 0, canvas.width, canvas.height);
      
/*       canvas.toBlob(async (blob) => {
        if(blob){

          const myFile = new File([blob], 'profile-picture.'+extension, {type: 'image/'+extension, lastModified: Date.now()});
          if (!myFile){
            setApiStatus('error');
            return;
          }
          const formData = new FormData();
          formData.append('file', myFile);
          setApiStatus('loading');
          const reponse =await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          if(!reponse.ok){
            setApiStatus('error');
            return;
          }
          const data = await reponse.json();
          const url = data.url;
          
          //save the path to the userPath state
          setApiStatus('success');
          updateUserProfilePicture(url);
          setProfilePicturePath(url);
          return;
        }
      }, 'image/'+extension)   */
    
     
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
        setPreviewImageURL(URL.createObjectURL(theFile));
      }
    } 
  }


  const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if(file){
      setDroppedFile(file);
      setPreviewImageURL(URL.createObjectURL(file));
    }
  }

  const handleMouseDown = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    //move the crop frame, container class name is crop-container
    const cropContainer = e.currentTarget;
    setIsDown(true);
    setInitialPageX(e.pageX);
    setInitialPageY(e.pageY);
    setInitialScrollLeft(cropContainer.scrollLeft);
    setInitialScrollTop(cropContainer.scrollTop);
  }
  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(!isDown){
      return;
    }
    const cropContainer = e.currentTarget;
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    const walkX = x - (initalPageX ?? 0);
    const walkY = y - (initalPageY ?? 0);
    cropContainer.scrollLeft = (initialScrollLeft ?? 0) - walkX;
    cropContainer.scrollTop = (initialScrollTop ?? 0) - walkY;
  }
  const zoomIn = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const img = document.querySelector('img') as HTMLImageElement;
    const container = document.querySelector('.crop-conainer') as HTMLDivElement;
    let scale = img.style.transform.replace(/[^0-9.]/g, '') || "1";
    let newScale = 0;
    newScale = parseFloat(scale) + 0.1;
    newScale = Math.min(Math.max(.125, newScale), 4);
    img.style.transform = `scale(${newScale})`;
    
  }
  const zoomOut = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const img = document.querySelector('img') as HTMLImageElement;
    const container = document.querySelector('.crop-conainer') as HTMLDivElement;
    let scale = img.style.transform.replace(/[^0-9.]/g, '') || "1";
    let newScale = 0;
    newScale = parseFloat(scale) - 0.1;
    newScale = Math.min(Math.max(.125, newScale), 4);
    img.style.transform = `scale(${newScale})`;
  }
  const updateUserProfilePicture = async (url:string) => {
    if(user){
      setApiStatus('updating');
      const response = await fetch(`/api/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          profilePicturePath: url,
        }),
      });
      if(!response.ok){
        setApiStatus('update-error');
      } else {
        setApiStatus('update-success');
      }
    }
  }
  useEffect(() => {
    if(apiStatus === 'update-success' && profilePicturePath && profilePicturePath.length > 0){
      dispatch(updateUser({
        ...user,
        profilePicturePath: profilePicturePath,
      }));
    }
  }, [apiStatus,profilePicturePath])
    return (
      <>
        <Head>
          <title>{theTitle}</title>
        </Head>
        <div className="flex grow flex-wrap">
            <h1>Edit Profile for {user.username} </h1>
            <button>Upload profile picture from your device</button>
            {<div onDragOver={handleCancelDragOver} className="text-center grow height-2/3 mx-auto container border rounded justify-center items-center" onDrop={handleDrop}>
                { apiStatus === 'idle' &&
                  <>
                    <h3>{droppedFile ? `${droppedFile.name} ready to upload` :"Drag and drop a file here"} </h3>
                    <form onSubmit={handleSubmit}>
                      {!droppedFile && 
                      <input type="file" ref={fileInputRef} onChange={handleFileInputChange}/>}
                      
                      <button type="submit">Use this image as profile picture</button>
                      {droppedFile&&
                      <>
                      <canvas id="image-canvas" className="w-48 h-48"></canvas>
                      <div onMouseDown={handleMouseDown} onMouseLeave={()=>{setIsDown(false)}} onMouseUp={()=>setIsDown(false)} onMouseMove={handleMouseMove} className="crop-conainer w-48 h-48 overflow-hidden mx-auto">
                        <img className="relative w-auto h-auto"  onDragStart={()=>false} src={previewImageURL??""}></img>
                      </div>
                      <div>
                        <button onClick={zoomIn}>+</button>
                        <button onClick={zoomOut}>-</button>

                      </div>
                        <p>Drag another file to replace or 
                          <button onClick={
                            (e) => {
                              e.preventDefault();
                              setDroppedFile(null);
                            }
                          }>Upload new</button>
                        </p>
                      </>
                      }
                    </form>
                  </>}
                { apiStatus === 'loading' && <h3>Uploading...</h3>}
                { apiStatus === 'success' && <h3>Upload successful</h3>}
                { apiStatus === 'error' && <h3>Upload failed <button onClick={()=>{setApiStatus('idle')}}>Try Again</button></h3>}
                { apiStatus === 'invalid' && <h3>Invalid file type <button onClick={()=>{setApiStatus('idle'); setDroppedFile(null)}}>Try Again</button></h3>}
                { apiStatus === 'updating' && <h3>Updating profile picture...</h3>}
                { apiStatus === 'update-success' && <h3>Profile picture updated <button onClick={()=>{setApiStatus('idle');setDroppedFile(null)}}>Change provile picture</button></h3>}
                { apiStatus === 'update-error' && <h3>Profile picture update failed <button onClick={()=>{setApiStatus('idle')}}>Try Again</button></h3>}
                
            </div>}

        </div>
      </>
    )
}