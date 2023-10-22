import React from "react";
import style from "./intext-suggestion.module.css";
import { useEffect } from "react";
import { current } from "@reduxjs/toolkit";
import { getContentHeight, getContentWidth, getDistanceFromLeftOfScrollableParent, getDistanceFromTopOfScrollableParent } from "../../../../libs/dimentions-calculations";
interface IntextSuggestionProps<T> {
    term?: string;
    handleSuggestionChose?: (suggestion: T) => void;
    setReveal: React.Dispatch<React.SetStateAction<boolean>>;
    reveal: boolean;
    triggerChar?: string; //the char that trigger the suggestion box
    suggestions: T[];
    suggestionJSX?: (suggestion: T, index: number) => React.JSX.Element;
    enableSuggestionMark?: boolean; //if true, the suggestion will be highlighted in the text
    suggestionMarkType?: string; //the pattern to mark the suggestion in the text;
    inputRef : React.MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>;
    suggestionContainerClassName?: string;
    content: string;
    topSuggestionClassName?: string;
    scrollListRef?: React.MutableRefObject<HTMLDivElement | null>;
    noAlternate?: boolean;
}
export default function IntextSuggestion<T extends {}>({ term, handleSuggestionChose, reveal, setReveal, triggerChar, suggestions, suggestionJSX, suggestionContainerClassName, inputRef, content, topSuggestionClassName, scrollListRef, noAlternate}: IntextSuggestionProps<T>) {
    const getTextSizeOfRef = (ref: React.MutableRefObject<HTMLTextAreaElement | HTMLInputElement | null>) => {
        if(ref.current){
            return parseFloat(window.getComputedStyle(ref.current).fontSize);
        }
    }
    const handleOutsideClick = (e: MouseEvent) => {
        if(e.target instanceof HTMLElement){
            if(!e.target.closest(`.${style['intext-suggestion']}`)){
                setReveal(false);
            }
        }
    }
    const suggestionsJSX = suggestions.map((suggestion, index) => {
        return suggestionJSX ?
                suggestionJSX(suggestion,index)
               : ""   
    })
    useEffect(()=>{
        if(reveal){
            //set the suggestion box position based on the cursor position
            if(inputRef && inputRef.current){
                const input = inputRef.current;
                const inputRect = input.getBoundingClientRect();
                const inputWidth = inputRect.width;
                const inputTop = input.offsetTop;
                const inputLeft = input.offsetLeft;
                const suggestionBox = document.querySelector(`.${style['intext-suggestion']}`) as HTMLDivElement;
                const renderedContent = document.querySelector(`.${style['content-rendered']}`) as HTMLDivElement;
                renderedContent.style.width = `${inputWidth}px`;
                renderedContent.style.top = `${inputTop}px`;
                renderedContent.style.left = `${inputLeft}px`;
                const renderedContentHtml = renderedContent.innerHTML;
                const newContent = renderedContentHtml.replace(/:/g, '<span class="insertion-point"></span>')
                renderedContent.innerHTML = newContent;
                const lineHeight = parseFloat(window.getComputedStyle(inputRef.current).lineHeight);
                
                const insertionPoint = document.querySelector(`.${style['content-rendered']} .insertion-point`) as HTMLSpanElement;
                if(insertionPoint){
                    const insertionPointTop = insertionPoint.offsetTop;
                    const insertionPointLeft = insertionPoint.offsetLeft;
                   
                    if(suggestionBox){
                        suggestionBox.style.top = `${insertionPointTop + inputTop + lineHeight + 4}px`;
                        suggestionBox.style.left = `${insertionPointLeft + inputLeft}px`;
                        if(scrollListRef && scrollListRef.current){
                            //compare left and right, if hit the right side, move the suggestion box to the left, if hit the bottom, move the suggestion box up
                            const scrollList = scrollListRef.current;
                            const scrollListHeight = getContentHeight(scrollList);
                            const scrollListWidth = getContentWidth(scrollList);
                            const suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;
                            const suggestionBoxWidth = suggestionBox.getBoundingClientRect().width;
                            const distanceOfInsertionFromTop = getDistanceFromTopOfScrollableParent(insertionPoint, scrollList);
                            const distanceOfInsertionFromLeft =getDistanceFromLeftOfScrollableParent(insertionPoint, scrollList);
                            if((distanceOfInsertionFromLeft + suggestionBoxWidth > scrollListWidth)){
                                //hit the right side
                                suggestionBox.style.left = `${insertionPointLeft + inputLeft - suggestionBoxWidth}px`;
                            }
                            if((distanceOfInsertionFromTop + suggestionBoxHeight > scrollListHeight)){
                                //hit the bottom
                                suggestionBox.style.top = `${insertionPointTop + inputTop - lineHeight - suggestionBoxHeight }px`;
                                suggestionBox.classList.add(topSuggestionClassName ?? "");
                            }
                        }
                        if(noAlternate){
                            const suggestionBoxHeight = suggestionBox.getBoundingClientRect().height;
                            suggestionBox.classList.add(topSuggestionClassName ?? "");
                            suggestionBox.style.top = `${insertionPointTop + inputTop - lineHeight - suggestionBoxHeight }px`;
                        }

                    }
                }     
            }
        }
    },[reveal])
    useEffect(()=>{
        if(reveal){
            document.addEventListener('click', handleOutsideClick);
        }
        return ()=>{
            document.removeEventListener('click', handleOutsideClick);
        }
    },[])
    return(
        <>
            <div className={style['content-rendered']}>
                {content}
            </div>
            <div className={
                `${suggestionContainerClassName ??  ""} ${style['intext-suggestion']}
                `
            }>
                {suggestionsJSX}
            </div>
        </>
    )
}