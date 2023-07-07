import React, { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ImCloudUpload } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import Slider from './../../../slider/Slider'
import { User } from '../../../../types/User';
interface EditBackgroundFormProps {
    user: User;
    editing: boolean;
    onBackgroundUpdated: (value: string) => void;
}
export default function EditBackgroundForm({ user, editing,onBackgroundUpdated}: EditBackgroundFormProps) {
      //apid status
    const [apiStatus, setApiStatus] = useState('idle');
    const [profileBackgroundPicturePath, setProfileBackgroundPicturePath] = useState<string | null>(""); //['/images/profile-pictures/default.png'
    const [droppedFile, setDroppedFile] = useState<Blob | null>(null);
    //image croping states
    const [previewImageURL, setPreviewImageURL] = useState<string | null>(null); 
    const [initialScrollLeft, setInitialScrollLeft] = useState<number | null>(null); 
    const [initialScrollTop, setInitialScrollTop] = useState<number | null>(null); 
    const [initalPageX, setInitialPageX] = useState<number | null>(null); 
    const [initalPageY, setInitialPageY] = useState<number | null>(null); //['/images/profile-pictures/default.png'
    const [isDown, setIsDown] = useState<boolean>(false); //['/images/profile-pictures/default.png'
    //Zooming states
    const [initlaImgWidth, setInitialImgWidth] = useState<number>(0);
    const [initlaImgHeight, setInitialImgHeight] = useState<number>(0);
    const [sliderValue, setSliderValue] = useState<number>(1) // [value, setter
    //Editing states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const maxScale = 4;
    const sliderStep = 0.1;
    const dispatch = useDispatch();
    const resetEditBackgroundForm = () => {
        setDroppedFile(null);
        setPreviewImageURL(null);
        setApiStatus('idle');
        setSliderValue(1);
      }
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
        const canvas = document.getElementById('bg-image-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        const img = document.querySelector('.crop-bg-image') as HTMLImageElement;
        const container = document.querySelector('.outer-container') as HTMLDivElement;
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
        
        canvas.toBlob(async (blob) => {
          if(blob){
            //convert blob to file
            const myFile = new File([blob], 'profile-background.'+extension, {type: 'image/'+extension, lastModified: Date.now()});
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
            updateUserProfileBackgroundPicture(url);
            setProfileBackgroundPicturePath(url);
            return;
          }
        }, 'image/'+extension)  
      
       
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
    const handleSliderChange = (value: number) => {
        setSliderValue(value);
    }
    const handleLoadPreviewImage = (e:React.SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.currentTarget;
        const container = document.querySelector('.outer-container') as HTMLDivElement;
        const containerRect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const imgWidth = imgRect.width;
        const imgHeight = imgRect.height;
        console.log(containerHeight,containerWidth)
        if (imgWidth < imgHeight) {
            img.style.width = containerWidth  + 'px';
        }else {
            img.style.height = containerHeight + 'px';
        }
        setInitialImgWidth(img.width);
        setInitialImgHeight(img.height);
      }
    const updateUserProfileBackgroundPicture = async (url:string) => {
        if(user){
            setApiStatus('updating');
            const response = await fetch(`/api/update-user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...user,
                backgroundPicturePath: url,
            }),
            });
            if(!response.ok){
                setApiStatus('update-error');
            } else {
                setApiStatus('update-success');
                onBackgroundUpdated(url);
            }
        }
    }

    useEffect(() => {
        //detect when slider value 
        const img = document.querySelector('.crop-bg-image') as HTMLImageElement;
        const container = document.querySelector('.outer-container') as HTMLDivElement;
        if(container){
          const containerRect = container.getBoundingClientRect();
          const imgRect = img.getBoundingClientRect();
          const containerWidth = containerRect.width;
          const containerHeight = containerRect.height;
          const imgWidth = imgRect.width;
          const imgHeight = imgRect.height;
    /*       if(imgWidth <= containerWidth || imgHeight <= containerHeight){
            return;
          } */
          img.style.width = (initlaImgWidth * sliderValue) + 'px';
          img.style.height = (initlaImgHeight * sliderValue) + 'px';
        }
      }, [sliderValue])
    useEffect(()=>{
        if(!editing){
            resetEditBackgroundForm();
        }
    },[editing])
    return (
        <div onDragOver={handleCancelDragOver} className={"text-center m mx-auto container rounded justify-center items-center self-start bg-indigo-900 p-32 w-full"} onDrop={handleDrop}>
        { apiStatus === 'idle' &&
        <>
            <ImCloudUpload className="w-20 h-20 mx-auto"/>
            <h3 className="mb-4 text-xl">{droppedFile ? `${droppedFile.name} ready to upload` :"Drag and drop your image here"} </h3>
            <form onSubmit={handleSubmit}>
                {!droppedFile && 
                <>                        
                <h3 className="text-xl">OR </h3>
                    <label className="action-btn block cursor-pointer mt-4"htmlFor="background-upload">
                    Upload from device
                    </label>
                <input type="file" id="background-upload" className="hidden" ref={fileInputRef} onChange={handleFileInputChange}/>
                </>
            }
                

                {/* Image uploading */}
                {droppedFile&&
                <>
                <div className="w-full pb-[30%] flex relative hidden">
                    <canvas id="bg-image-canvas" className="w-full full absolute"></canvas>
                </div>
                
                
                <div className="w-full pb-[30%] flex relative outer-container">
                    <div onMouseDown={handleMouseDown} onMouseLeave={()=>{setIsDown(false)}} onMouseUp={()=>setIsDown(false)} onMouseMove={handleMouseMove} className={"crop-bg-conainer w-full h-full overflow-hidden mx-auto border border-white rounded absolute top-0 left-0" + (isDown ? "cursor-move" : "cursor-pointer")}>
                        <img onLoad={handleLoadPreviewImage} className="relative w-auto h-auto crop-bg-image  max-w-none rounded"onDragStart={()=>false} src={previewImageURL??""}></img>

                    </div>
                </div>

                {/* Zoom in and out */}
                <Slider
                    min={1}
                    step={sliderStep} 
                    max={maxScale} 
                    value={sliderValue} 
                    defaultValue={1} 
                    onSliderChange={handleSliderChange}
                    thumbActiveClassName="btn-active"
                    thumbClassName="hover-btn-active"
                />
                <p>Tips: Drag the image to adjust the crop area</p>
                    <button className="action-btn" onClick={
                    (e) => {
                        e.preventDefault();
                        setDroppedFile(null);
                    }
                    }>Upload new</button>
                    <button className="action-btn ml-4 mt-4" type="submit">Use this image as profile picture</button>
                </>
                }
            </form>
            </>}
            {/* Update status of image uploading */}
            { apiStatus === 'loading' && <h3>Uploading...</h3>}
            { apiStatus === 'success' && <h3>Upload successful</h3>}
            { apiStatus === 'error' && <h3>Upload failed <button onClick={()=>{setApiStatus('idle')}}>Try Again</button></h3>}
            { apiStatus === 'invalid' && <h3>Invalid file type <button onClick={()=>{setApiStatus('idle'); setDroppedFile(null)}}>Try Again</button></h3>}
            { apiStatus === 'updating' && <h3>Updating profile picture...</h3>}
            { apiStatus === 'update-success' && <><h3>Profile picture updated </h3>
            <button className="action-btn mx-auto mt-4" onClick={()=>{resetEditBackgroundForm()}}>Update another profile picture</button>
            </>}
            { apiStatus === 'update-error' && <h3>Profile picture update failed <button  className="action-btn mx-auto mt-4" onClick={()=>{setApiStatus('idle')}}>Try Again</button></h3>}
        </div>
    )
    
}