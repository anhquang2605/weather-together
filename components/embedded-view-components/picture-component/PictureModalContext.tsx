import { ObjectId } from 'mongodb';
import {createContext, useState, useContext, ReactNode, useEffect} from 'react';
export interface PictureContent{
    src: string;
    width: number;
    height: number;
    alt: string;
    author: string;
    _id: string | ObjectId;
}
interface IPictureModalContext{
    content: PictureContent | null;
    show: boolean;
    setShow: (show: boolean) => void;
    setContent: (content: PictureContent | null) => void;
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
    const [content, setContent] = useState<PictureContent | null>(null); // [src, width, height, alt
    const [show, setShow] = useState(false);
    return (
        <PictureModalContext.Provider value={{content, setContent, show, setShow}}>
            {children}
        </PictureModalContext.Provider>
    );
}
