import { useEffect, useRef, useState } from "react";
import { EMOJIS } from "../../../../constants/emojis";
import {IoHappy} from 'react-icons/io5';
import style from "./emoji-selector.module.css";
interface EmojiSelectorProps {
    handleEmojiSelect: (emoji: string) => void;
    buttonClassName?: string;
}
export default function EmojiSelector({ handleEmojiSelect, buttonClassName }: EmojiSelectorProps) {
    const [reveal, setReveal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [emojisSelections, setEmojisSelections] = useState(EMOJIS);
    const [listPosition, setListPosition] = useState('bottom');
    const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
    const emojiListRef = useRef<HTMLDivElement | null>(null);
    const handleEmojiButtonClick = () => {
        setReveal(prev => !prev);
        if(reveal){
            if(emojiButtonRef.current && emojiListRef.current){
                const btnRect = emojiButtonRef.current.getBoundingClientRect();
                const listRect = emojiListRef.current.getBoundingClientRect();
                const listHeight = listRect.height;
                const distanceToBottom = window.innerHeight - btnRect.bottom;
                const threshold = listHeight + 16;
                if(distanceToBottom < threshold){
                    setListPosition('top');
                }else{
                    setListPosition('bottom');
                }
            }
        }
    }
    const handleEmojiClick = (emoji: string) => {

        handleEmojiSelect(emoji);
        setReveal(false);
    }
    const handleEmojiSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    }
    const emojisSelectionsJSX = emojisSelections.map((emoji, index) => (
        <button
            key={index}
            title={emoji.name}
            className={style['emoji-selection']}
            onClick={() => handleEmojiClick(emoji.emoji)}
        >
            {emoji.emoji}
        </button>
    ))
    useEffect(()=>{
        
    },[])
    return(
        <div className={style["emoji-selector"]}>
            <button
                ref={emojiButtonRef} 
                className={style['emoji-list-reveal-btn']}
                onClick={()=>
                    {
                        handleEmojiButtonClick();
                        
                    }
                }    
            >
                <IoHappy className="icon" />
            </button>
            <div ref={emojiListRef} 
                className={
                    `
                        ${style['emoji-list']} 
                        ${(reveal? 'reveal' : "")} 
                        ${style[listPosition]}
                    `
                    }>
                <div className={style['emoji-list__search']}>
                    <input value={searchTerm} onChange={handleEmojiSearch} placeholder="Search for emoji">
                    </input>
                </div>
                <div className={style['emoji-list__selections']}>
                    {emojisSelectionsJSX}
                </div>
            </div>
        </div>
    )
}