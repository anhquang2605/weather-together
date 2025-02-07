import { ObjectId } from 'mongodb';
import {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import { usernameToProfilePicturePathMap } from '../../../pages/api/users';
import { Picture } from '../../../types/Picture';

interface IPictureModalContext{
    content: Picture | null;
    show: boolean;
    setShow: (show: boolean) => void;
    setContent: (content: Picture | null) => void;
    profilePicturePaths: usernameToProfilePicturePathMap;
    setProfilePicturePaths: (profilePicturePaths: usernameToProfilePicturePathMap) => void;
    setCurrentPictureIndex: (index: number) => void;
    setPictures: (pictures: Picture[]) => void;
    showNext: () => void;
    showPrevious: () => void;
    isSlider: boolean;
}
const PictureModalContext = createContext<IPictureModalContext | undefined>(undefined);

// This hook is used to access the context from a child component
export const usePictureModal = () => {
    const context = useContext(PictureModalContext);
    if(!context){
        throw new Error('usePictureModal must be used within a PictureModalProvider');
    }
    return context;
}

interface IPictureModalProviderProps{
    children: ReactNode;
}
// This component provides the context to its children
export const PictureModalProvider = ({children}: IPictureModalProviderProps) => {
    const [content, setContent] = useState<Picture | null>(null); // [src, width, height, alt
    const [show, setShow] = useState(false);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [profilePicturePaths, setProfilePicturePaths] = useState<usernameToProfilePicturePathMap>({});
    const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0);
    const [isSlider, setIsSlider] = useState<boolean>(false);
    const showNext = () => {
        setCurrentPictureIndex(prev => {
            if(prev === pictures.length - 1){
                return 0;
            }
            return prev + 1;
        })
    }
    const showPrevious = () => {
        setCurrentPictureIndex(prev => {
            if(prev === 0){
                return pictures.length - 1;
            }
            return prev - 1;
        })
    }
    const resetStates = () => {
        setContent(null);
        setShow(false);
        setPictures([]);
        setCurrentPictureIndex(0);
    }
    //help solve the problem where the notification bell is infront of the picture modal, the parent of this modal has a z-index of 10 while the notification bell has a z-index of 40. 
    const changeNotificationZIndex = (show: boolean) => {
        const notificationComponent = document.getElementById('notification-component');
        let notiZIndex = 0;
        if(notificationComponent){
            notiZIndex = parseInt(window.getComputedStyle(notificationComponent).zIndex);
        }    
        if(notificationComponent){
            if(show) {
                notificationComponent.style.zIndex = (notiZIndex - 21).toString();
            } else {
                notificationComponent.style.zIndex = (notiZIndex + 21).toString();
            }
        }
    }
    useEffect(()=>{
        setContent(pictures[currentPictureIndex]);
    },[currentPictureIndex])
    useEffect(()=>{
        if(pictures.length > 1){
            setIsSlider(true);
        }else{
            setIsSlider(false);
        }
    },[pictures])
    useEffect(()=>{
        if(!show){
            resetStates();
        }
        changeNotificationZIndex(show);
    },[show])
    return (
        <PictureModalContext.Provider value={{setCurrentPictureIndex, setPictures, profilePicturePaths, setProfilePicturePaths,content, setContent, show, setShow, showNext, showPrevious, isSlider}}>
            {children}
        </PictureModalContext.Provider>
    );
}
