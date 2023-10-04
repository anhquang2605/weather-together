import React,{ useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react';
import Modal from './Modal';
import { set } from 'lodash';
/**
 * This is a context provider for the modal component
 * First we need to wrap the app with this provider
 * whenever someone want to open the modal, we will reset the content and set the showModal to true
 */
interface ModalContextType{//exposing the api of the modal context
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
    setExtraCloseFunction: React.Dispatch<React.SetStateAction<()=>void>>;
    setContainerClassName: React.Dispatch<React.SetStateAction<string>>;
    containerClassName: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}
interface ModalProviderProps{
    children: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext(): ModalContextType{
    const context = useContext(ModalContext);
    if(!context){
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export function ModalProvider({children}: ModalProviderProps){
    const [title, setTitle] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [content, setContent] = useState<React.ReactNode>(null);
    const [containerClassName, setContainerClassName] = useState<string>('');
    const handleReset = () => {
        setContent(null);
        setContainerClassName('');
        setTitle('');
    }
    const [extraCloseFunction, setExtraCloseFunction] = useState<()=>void>(()=>{});
    const onCloseHandler = useCallback(()=>{
        setShowModal(false);
        handleReset();
        if(extraCloseFunction){
            extraCloseFunction();
        }
    }, [extraCloseFunction])
    const value = useMemo(() => {//memoize the value so that it will not be re-created on every render, only when the dependencies change
        return { showModal, setShowModal, setContent, setExtraCloseFunction, setContainerClassName, containerClassName, setTitle };
    }, [showModal, setShowModal, setContent, setExtraCloseFunction, setContainerClassName, containerClassName, setTitle]);

    return (
        <ModalContext.Provider value={value}>
            {children}
            {showModal &&  content && <Modal title={title} status={showModal} containerClassName={containerClassName}  onClose={()=>{onCloseHandler()}}>{content}</Modal>}
        </ModalContext.Provider>
    )
}