import React, { useState } from 'react';
import style from './buddy-tag-form.module.css';
import {IoReturnUpBack} from 'react-icons/io5'
import SearchBar from '../../../../plugins/search-bar/SearchBar';

interface BuddyTagFormProps {
    addBuddyTag: (buddyUsername: string) => void;
    removeBuddyTag: (buddyUsername: string) => void;
}   

const FriendTagForm: React.FC<BuddyTagFormProps> = ({}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const handleSetTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }
    const handleSearch = () => {
        if(searchTerm.length){
            
        }
    }
    const handleOnSearch = () => {

    }
    return (
        <div className={style['buddy-tag-form']}>
            <button className="flex flex-row items-center" onClick={()=>{

            }}>
                    <IoReturnUpBack className="w-8 h-8 mr-2"/>
            </button>
            <div className="my-4">
                <SearchBar
                    query={searchTerm}
                    setQuery={handleSetTerm}
                    placeholder='Search for buddies'
                    onSearch={handleOnSearch}
                    variant="bordered"
                    autoCompleteSearch={true}
                />
            </div>
           
        </div>
    );
};

export default FriendTagForm;