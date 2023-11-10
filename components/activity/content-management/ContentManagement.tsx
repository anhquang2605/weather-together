import React, { useEffect, useState } from 'react';
import style from './content-management.module.css';
import {IoEllipsisHorizontal} from 'react-icons/io5';
import ControlOption from './control-option/ControlOption';
export interface ManagementItem{
    type: string; //edit, delete, save.... for title and icons
    handler: () => void; //handler function in a form of higher order function
    description?: string; //description for the item
   
}

interface ContentManagementProps {
    items: ManagementItem[];
    isOwner: boolean; //if the user is the owner of the post
}

const ContentManagement: React.FC<ContentManagementProps> = ({
    items,
    isOwner
}) => {
    const [reveal, setReveal] = useState<boolean>(false);
    const handleToggleReveal = () => {
        setReveal(prev => !prev);
    }
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if(target.closest(`.${style['content-management']}`)){
                return;
            }
            setReveal(false);
        }
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        }
    }, []);
    return (
        <div className={style['content-management']}>
            <button 
              onClick={handleToggleReveal}
              className={`${style["control-reveal-btn"]} ${reveal && style['active']}`}>
                <IoEllipsisHorizontal/>
            </button>
            <div className={`${style["control-list"]} ${reveal ? style['reveal'] : ""}`}>
                {
                    items.map((item, index) => {
                        
                        const {type, handler, description} = item;
                        if(type !== 'Save' && !isOwner){
                            return null;
                        }
                        return(
                            <ControlOption
                                key={index}
                                title={type}
                                description={description}
                                onClick={handler}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ContentManagement;