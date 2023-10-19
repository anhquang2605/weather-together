import { useEffect, useRef, useState } from "react";
import { EMOJIS } from "../../../../constants/emojis";
import {IoHappy} from 'react-icons/io5';
import style from "./emoji-selector.module.css";
import { getContentHeight, getContentWidth } from "../../../../libs/dimentions-calculations";
interface EmojiSelectorProps {
    handleEmojiSelect: (emoji: string) => void;
    buttonClassName?: string;
    containerRef?: React.MutableRefObject<HTMLElement | null>;
    size?: string;
    noAlternate?: boolean;
}
export default function EmojiSelector({ handleEmojiSelect, buttonClassName, containerRef, size, noAlternate }: EmojiSelectorProps) {
    const [reveal, setReveal] = useState(false);
    const [emojisSelections, setEmojisSelections] = useState(EMOJIS);
    const [listPosition, setListPosition] = useState('top');

    const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
    const emojiListRef = useRef<HTMLDivElement | null>(null);
    const handleEmojiButtonClick = () => {
        setReveal(prev => !prev);
        if(noAlternate){
            return;
        }
        if(emojiButtonRef.current && emojiListRef.current){
            const btn = emojiButtonRef.current;

            const listRect = emojiListRef.current.getBoundingClientRect();
            const listHeight = listRect.height;
            let containerHeight;
            let distanceToBottom;
            if(containerRef && containerRef.current){
                const btnRect = btn.getBoundingClientRect();
                const containerRect = containerRef?.current?.getBoundingClientRect();
               containerHeight = getContentHeight(containerRef.current);
                const buttonScrolledDistance = (btnRect.top - containerRect.top) + containerRef.current.scrollTop;
               distanceToBottom = containerHeight - buttonScrolledDistance;
            }else {
                containerHeight = window.innerHeight;
                distanceToBottom = containerHeight - btn.scrollTop;
            }

            const threshold = listHeight + 16;

            if(distanceToBottom > threshold){
                setListPosition('bottom');
            }else{
                setListPosition('top');
            }
        }
    }
    const handleEmojiClick = (emoji: string) => {

        handleEmojiSelect(emoji);
        setReveal(false);
    }
    const handleEmojiSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleEmojiFilterSearchTerm(e.target.value.toLowerCase());
    }
    const handleOuterClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if(emojiListRef.current && emojiButtonRef.current){
            if(!emojiListRef.current.contains(target) && !emojiButtonRef.current.contains(target)){
                setReveal(false);
            }
        }
    }
    const handleEmojiFilterSearchTerm = (searchTerm: string) => {
        const filteredEmojis = EMOJIS.filter(emoji => emoji.name.toLowerCase().includes(searchTerm));
        setEmojisSelections(filteredEmojis);
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
        document.addEventListener('click', handleOuterClick);
        return () => {
            document.removeEventListener('click', handleOuterClick);
        }
    },[])
    return(
        <div className={style["emoji-selector"]}>
            <button
                ref={emojiButtonRef} 
                className={`
                ${style['emoji-list-reveal-btn']} 
                ${buttonClassName}
                `}
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
                        ${(reveal? style['reveal'] : "")} 
                        ${style[listPosition]}  
                        ${size && style[size]}
                    `
                    }>
                <div className={style['emoji-list__search']}>
                    <input type="text" onChange={handleEmojiSearch} placeholder="Search for emoji">
                    </input>
                </div>
                <div className={style['emoji-list__selections']}>
                    {emojisSelectionsJSX}
                </div>
            </div>
        </div>
    )
}